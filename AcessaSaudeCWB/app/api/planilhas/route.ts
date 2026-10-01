import { NextResponse } from "next/server"

export const runtime = "nodejs"

const allowedReads = new Set(["unidades", "agendamentos", "triagens"])
const allowedWrites = new Set(["access", "appointment", "triage"])

function getScriptUrl() {
  return process.env.GOOGLE_APPS_SCRIPT_URL
}

function upstreamError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

export async function GET(request: Request) {
  const scriptUrl = getScriptUrl()
  if (!scriptUrl) return upstreamError("GOOGLE_APPS_SCRIPT_URL não está configurada.", 503)

  const requestUrl = new URL(request.url)
  const action = requestUrl.searchParams.get("action") || "unidades"
  if (!allowedReads.has(action)) return upstreamError("Ação de leitura inválida.", 400)

  const upstreamUrl = new URL(scriptUrl)
  upstreamUrl.searchParams.set("action", action)
  const email = requestUrl.searchParams.get("email")?.trim()
  if (email) upstreamUrl.searchParams.set("email", email)

  try {
    const upstream = await fetch(upstreamUrl, { cache: "no-store", redirect: "follow" })
    const payload = await upstream.json()
    return NextResponse.json(payload, { status: upstream.ok && payload.ok !== false ? 200 : 502 })
  } catch {
    return upstreamError("Não foi possível consultar o Google Sheets.", 502)
  }
}

export async function POST(request: Request) {
  const scriptUrl = getScriptUrl()
  if (!scriptUrl) return upstreamError("GOOGLE_APPS_SCRIPT_URL não está configurada.", 503)

  let payload: Record<string, unknown>
  try {
    payload = await request.json()
  } catch {
    return upstreamError("O corpo da solicitação não é um JSON válido.", 400)
  }

  const action = String(payload.action || "").toLowerCase()
  if (!allowedWrites.has(action)) return upstreamError("Ação de gravação inválida.", 400)

  try {
    const upstream = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
      redirect: "follow",
    })
    const result = await upstream.json()
    return NextResponse.json(result, { status: upstream.ok && result.ok !== false ? 200 : 502 })
  } catch {
    return upstreamError("Não foi possível gravar no Google Sheets.", 502)
  }
}