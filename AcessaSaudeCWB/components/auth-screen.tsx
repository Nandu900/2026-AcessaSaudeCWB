"use client"

import { useState, type FormEvent } from "react"
import type { SupabaseClient } from "@supabase/supabase-js"
import { Mail } from "lucide-react"

interface AuthScreenProps {
  client: SupabaseClient | null
}

export function AuthScreen({ client }: AuthScreenProps) {
  const [email, setEmail] = useState("")
  const [sentTo, setSentTo] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [sending, setSending] = useState(false)

  const sendAccessLink = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!client) return

    setSending(true)
    setErrorMessage("")
    setSentTo("")

    const { error } = await client.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      setErrorMessage(error.message)
    } else {
      setSentTo(email.trim())
    }
    setSending(false)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)] p-5">
      <section className="w-full max-w-sm rounded-2xl border border-white/70 bg-white p-6 shadow-lg">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
          <Mail className="h-6 w-6" />
        </div>
        <h1 className="text-xl font-bold text-primary">Entrar no AcessaSaudeCWB</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Informe seu e-mail para receber um link de acesso. Não é necessário criar senha.
        </p>

        {client ? (
          <form onSubmit={sendAccessLink} className="mt-6">
            <label htmlFor="auth-email" className="mb-1.5 block text-sm font-medium text-foreground">
              E-mail
            </label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="voce@exemplo.com"
            />
            {errorMessage && <p role="alert" className="mt-3 text-sm text-destructive">{errorMessage}</p>}
            {sentTo && (
              <p role="status" className="mt-3 text-sm text-success">
                Link enviado para {sentTo}. Confira sua caixa de entrada.
              </p>
            )}
            <button
              type="submit"
              disabled={sending}
              className="mt-4 w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"
            >
              {sending ? "Enviando link..." : "Enviar link de acesso"}
            </button>
          </form>
        ) : (
          <p role="alert" className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm text-foreground">
            Supabase ainda não está configurado neste ambiente. Adicione as variáveis do arquivo .env.example ao .env.local para testar o preview.
          </p>
        )}
      </section>
    </main>
  )
}