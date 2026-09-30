"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Clock, MapPin, Stethoscope, CheckCircle2, ArrowLeft } from "lucide-react"

interface Appointment {
  id: string
  especialidade: string
  unidade: string
  data: string
  horario: string
  posicaoFila: number
  tempoEstimado: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    especialidade: "Clinico Geral",
    unidade: "UBS Boqueirao",
    data: "15/03/2026",
    horario: "14:30",
    posicaoFila: 3,
    tempoEstimado: "15-20 min",
  },
  {
    id: "2",
    especialidade: "Odontologia",
    unidade: "UBS Campo Comprido",
    data: "22/03/2026",
    horario: "09:00",
    posicaoFila: 8,
    tempoEstimado: "40-50 min",
  },
]

interface AcompanharScreenProps {
  onNavigate: (screen: string) => void
}

export function AcompanharScreen({ onNavigate }: AcompanharScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const selected = mockAppointments.find((a) => a.id === selectedId)

  // Detail view
  if (selected) {
    return (
      <div className="bg-background h-full flex flex-col pb-20">
        <header className="bg-[oklch(0.52_0.12_240)] text-[oklch(0.99_0_0)] px-4 py-4 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => {
              setSelectedId(null)
              setConfirmed(false)
            }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Detalhes do Atendimento</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          {/* Queue Position */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border text-center mb-4">
            <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Sua posicao na fila
            </p>
            <p className="text-5xl font-bold text-primary mb-1">{selected.posicaoFila}&#186;</p>
            <p className="text-sm text-muted-foreground">Tempo estimado: {selected.tempoEstimado}</p>
          </div>

          {/* Details Card */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Informacoes
            </p>
            <div className="flex flex-col gap-3">
              <DetailRow label="Especialidade" value={selected.especialidade} icon={Stethoscope} />
              <div className="h-px bg-border" />
              <DetailRow label="Unidade" value={selected.unidade} icon={MapPin} />
              <div className="h-px bg-border" />
              <DetailRow label="Data" value={`${selected.data} as ${selected.horario}`} icon={Clock} />
            </div>
          </div>

          {/* Confirm Presence */}
          {confirmed ? (
            <div className="bg-success/10 border border-success/20 rounded-2xl p-5 text-center">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
              <p className="font-bold text-success text-base">Presenca Confirmada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Aguarde ser chamado(a) no painel.
              </p>
            </div>
          ) : (
            <button
              onClick={() => setConfirmed(true)}
              className="w-full bg-success text-success-foreground font-bold py-4 rounded-xl transition-all hover:bg-success/90 active:scale-[0.98] text-base"
            >
              Confirmar Presenca
            </button>
          )}
        </main>
      </div>
    )
  }

  // List view
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Acompanhar" onBack={() => onNavigate("home")} variant="info" />
      <main className="flex-1 overflow-y-auto p-5">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Seus atendimentos ativos
        </p>
        <div className="flex flex-col gap-3">
          {mockAppointments.map((appt) => (
            <button
              key={appt.id}
              onClick={() => setSelectedId(appt.id)}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-all hover:shadow-md active:scale-[0.98] w-full"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{appt.especialidade}</h3>
                    <p className="text-sm text-muted-foreground">{appt.unidade}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0">
                  {appt.posicaoFila}&#186; fila
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{appt.data} - {appt.horario}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

function DetailRow({ label, value, icon: Icon }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
