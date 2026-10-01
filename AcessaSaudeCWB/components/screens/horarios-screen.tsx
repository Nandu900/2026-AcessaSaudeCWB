"use client"

import { useState } from "react"
import { CalendarDays, CheckCircle2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const horariosPorPeriodo = {
  manha: ["08:30", "09:30", "10:30", "11:30"],
  tarde: ["13:00", "14:00", "15:00", "16:00"],
}

type Periodo = keyof typeof horariosPorPeriodo

interface HorariosScreenProps {
  nome: string
  email: string
  onRegister: (consulta: { data: string; horario: string }) => Promise<void>
  onNavigate: (screen: string) => void
}

export function HorariosScreen({ nome, email, onRegister, onNavigate }: HorariosScreenProps) {
  const [data, setData] = useState("")
  const [periodo, setPeriodo] = useState<Periodo | "">("")
  const [horario, setHorario] = useState("")
  const [confirmado, setConfirmado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState("")

  const dataFormatada = data
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(`${data}T12:00:00`))
    : ""

  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Horários de teleatendimento" onBack={() => onNavigate("sintomas")} variant="success" />
      <main className="flex-1 overflow-y-auto p-5">
        {confirmado ? (
          <section className="bg-card rounded-2xl p-6 shadow-sm border border-border text-center">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
            <h2 className="text-lg font-bold text-foreground mb-2">Solicitação registrada</h2>
            <p className="text-sm font-semibold text-foreground">{dataFormatada} às {horario}</p>
            <p className="text-sm text-muted-foreground mt-4">
              A solicitação foi registrada para {nome} ({email}). O horário ainda não foi confirmado pela unidade.
            </p>
            <button
              onClick={() => onNavigate("home")}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-xl mt-5 transition-colors hover:bg-primary/90"
            >
              Voltar ao início
            </button>
          </section>
        ) : (
          <>
            <section className="bg-card rounded-2xl p-5 shadow-sm border border-border">
              <label htmlFor="teleatendimento-date" className="block text-sm font-semibold text-foreground mb-2">
                1. Escolha a data
              </label>
              <div className="relative mb-5">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  id="teleatendimento-date"
                  type="date"
                  value={data}
                  onChange={(event) => {
                    setData(event.target.value)
                    setPeriodo("")
                    setHorario("")
                  }}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <label htmlFor="teleatendimento-periodo" className="block text-sm font-semibold text-foreground mb-2">
                2. Escolha o período
              </label>
              <select
                id="teleatendimento-periodo"
                value={periodo}
                disabled={!data}
                onChange={(event) => {
                  setPeriodo(event.target.value as Periodo | "")
                  setHorario("")
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground mb-5 focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione manhã ou tarde</option>
                <option value="manha">Manhã</option>
                <option value="tarde">Tarde</option>
              </select>

              <label htmlFor="teleatendimento-horario" className="block text-sm font-semibold text-foreground mb-2">
                3. Escolha o horário
              </label>
              <select
                id="teleatendimento-horario"
                value={horario}
                disabled={!periodo}
                onChange={(event) => setHorario(event.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione um horário</option>
                {periodo && horariosPorPeriodo[periodo].map((opcao) => (
                  <option key={opcao} value={opcao}>{opcao}</option>
                ))}
              </select>
            </section>
            <p className="text-xs text-white mt-4">
              Horários demonstrativos; a reserva depende da integração com a agenda.
            </p>
            <button
              type="button"
              disabled={!data || !horario}
              onClick={async () => {
                setErro("")
                setSalvando(true)
                try {
                  await onRegister({ data, horario })
                  setConfirmado(true)
                } catch (error) {
                  setErro(error instanceof Error ? error.message : "Não foi possível registrar o horário.")
                } finally {
                  setSalvando(false)
                }
              }}
              className="w-full bg-success text-success-foreground font-bold py-4 rounded-xl mt-4 transition-all hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? "Registrando..." : "Solicitar horário"}
            </button>
            {erro && <p role="alert" className="mt-3 rounded-xl border border-destructive/20 bg-white p-3 text-sm text-destructive">{erro}</p>}
          </>
        )}
      </main>
    </div>
  )
}