"use client"

import { useState } from "react"
import { CheckCircle2, Clock3, MapPin, Search, Tablet } from "lucide-react"
import { PageHeader } from "@/components/page-header"

const demoAppointments = [
  {
    codigo: "ACB-1024",
    nome: "Ana Martins",
    especialidade: "Clínica Geral",
    unidade: "US Abaeté",
    data: "13/10/2026",
    horario: "09:30",
  },
  {
    codigo: "ACB-1025",
    nome: "Carlos Souza",
    especialidade: "Odontologia",
    unidade: "UPA Boa Vista",
    data: "13/10/2026",
    horario: "10:15",
  },
]

interface TotemScreenProps {
  onNavigate: (screen: string) => void
}

export function TotemScreen({ onNavigate }: TotemScreenProps) {
  const [codigo, setCodigo] = useState("")
  const [confirmado, setConfirmado] = useState(false)
  const appointment = demoAppointments.find((item) => item.codigo === codigo.trim().toUpperCase())

  const chooseExample = (sampleCode: string) => {
    setCodigo(sampleCode)
    setConfirmado(false)
  }

  return (
    <div className="h-full flex flex-col pb-20 bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
      <PageHeader title="Totem de confirmação" onBack={() => onNavigate("mais")} />
      <main className="flex-1 overflow-y-auto bg-transparent p-5">
        <section className="mb-4 rounded-2xl border border-white/70 bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Tablet className="h-6 w-6" />
          </div>
          <h2 className="font-bold text-foreground">Confirme sua presença</h2>
          <p className="mt-1 text-sm text-muted-foreground">Informe o código do agendamento no totem da unidade.</p>
          <span className="mt-3 inline-flex rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-foreground">Demonstração com dados fictícios</span>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <label htmlFor="totem-code" className="mb-2 block text-sm font-semibold text-foreground">
            Código do agendamento
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="totem-code"
              value={codigo}
              onChange={(event) => {
                setCodigo(event.target.value.toUpperCase())
                setConfirmado(false)
              }}
              placeholder="Ex.: ACB-1024"
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <p className="mb-2 mt-4 text-xs font-medium text-muted-foreground">Códigos para testar</p>
          <div className="flex flex-wrap gap-2">
            {demoAppointments.map((item) => (
              <button
                key={item.codigo}
                type="button"
                onClick={() => chooseExample(item.codigo)}
                className="rounded-full border border-border bg-secondary px-3 py-2 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80"
              >
                {item.codigo}
              </button>
            ))}
          </div>
        </section>

        {appointment && (
          <section className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
            {confirmado ? (
              <div role="status" className="text-center">
                <CheckCircle2 className="mx-auto mb-2 h-10 w-10 text-success" />
                <h2 className="font-bold text-success">Presença confirmada</h2>
                <p className="mt-1 text-sm text-muted-foreground">Registro fictício desta demonstração.</p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Paciente</p>
                    <h2 className="mt-1 font-bold text-foreground">{appointment.nome}</h2>
                    <p className="text-sm text-muted-foreground">{appointment.especialidade}</p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{appointment.codigo}</span>
                </div>
                <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" />{appointment.unidade}</p>
                  <p className="flex items-center gap-2"><Clock3 className="h-4 w-4 shrink-0" />{appointment.data} às {appointment.horario}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmado(true)}
                  className="mt-5 w-full rounded-xl bg-success py-3.5 font-bold text-success-foreground transition-colors hover:bg-success/90"
                >
                  Confirmar presença
                </button>
              </>
            )}
          </section>
        )}
        {codigo && !appointment && <p className="mt-4 rounded-xl bg-white p-4 text-sm text-muted-foreground">Nenhum agendamento de demonstração encontrado para esse código.</p>}
      </main>
    </div>
  )
}