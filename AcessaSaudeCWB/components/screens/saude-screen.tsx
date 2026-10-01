"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import {
  Calendar,
  Stethoscope,
  ClipboardList,
  CheckCircle2,
  ArrowLeft,
  FlaskConical,
} from "lucide-react"

interface PastAppointment {
  id: string
  especialidade: string
  medico: string
  unidade: string
  data: string
  exames: Exame[]
}

interface Exame {
  nome: string
  status: "pendente" | "realizado"
}

const pastAppointments: PastAppointment[] = [
  {
    id: "1",
    especialidade: "Clinico Geral",
    medico: "Dr. Carlos Mendes",
    unidade: "UBS Boqueirao",
    data: "10/02/2026",
    exames: [
      { nome: "Hemograma Completo", status: "pendente" },
      { nome: "Glicemia em Jejum", status: "pendente" },
      { nome: "Colesterol Total", status: "realizado" },
    ],
  },
  {
    id: "2",
    especialidade: "Odontologia",
    medico: "Dra. Ana Paula",
    unidade: "UBS Campo Comprido",
    data: "28/01/2026",
    exames: [
      { nome: "Radiografia Panoramica", status: "realizado" },
    ],
  },
  {
    id: "3",
    especialidade: "Pediatria",
    medico: "Dr. Roberto Lima",
    unidade: "UPA Sitio Cercado",
    data: "15/01/2026",
    exames: [],
  },
]

interface SaudeScreenProps {
  onNavigate: (screen: string) => void
}

export function SaudeScreen({ onNavigate }: SaudeScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = pastAppointments.find((a) => a.id === selectedId)

  // Detail view with exams
  if (selected) {
    return (
      <div className="h-full flex flex-col pb-20 bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
        <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Exames Necessarios</h1>
        </header>
        <main className="flex-1 overflow-y-auto bg-transparent p-5">
          {/* Appointment summary */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">{selected.especialidade}</h3>
                <p className="text-sm text-muted-foreground">{selected.medico}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>{selected.data} - {selected.unidade}</span>
            </div>
          </div>

          {/* Exams List */}
          <p className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
            Exames solicitados
          </p>
          {selected.exames.length === 0 ? (
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border text-center">
              <ClipboardList className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">
                Nenhum exame foi solicitado nesta consulta.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {selected.exames.map((exame, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-white shadow-sm"
                >
                  {exame.status === "realizado" ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  ) : (
                    <FlaskConical className="w-5 h-5 text-[oklch(0.65_0.15_80)] shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">{exame.nome}</p>
                    <p className={`text-xs font-medium mt-0.5 ${
                      exame.status === "realizado" ? "text-success" : "text-[oklch(0.65_0.15_80)]"
                    }`}>
                      {exame.status === "realizado" ? "Realizado" : "Pendente"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    )
  }

  // List view
  return (
    <div className="h-full flex flex-col pb-20 bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
      <PageHeader title="Saude" onBack={() => onNavigate("home")} />
      <main className="flex-1 overflow-y-auto bg-transparent p-5">
        <div className="mb-4 flex items-center gap-3">
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-white/80" />
          <h2 className="text-base font-bold text-white text-center">Histórico de consultas</h2>
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-white/80" />
        </div>
        <div className="flex flex-col gap-3">
          {pastAppointments.map((appt) => (
            <button
              key={appt.id}
              onClick={() => setSelectedId(appt.id)}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-all hover:shadow-md active:scale-[0.98] w-full"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-foreground text-base">{appt.especialidade}</h3>
                    {appt.exames.length > 0 && (
                      <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0 ml-2">
                        {appt.exames.filter((e) => e.status === "pendente").length} pendente(s)
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{appt.medico}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1.5">
                    <Calendar className="w-3 h-3" />
                    <span>{appt.data} - {appt.unidade}</span>
                  </div>
                </div>
              </div>
              {appt.exames.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-xs font-medium text-primary flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5" />
                    Verificar exames necessarios
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
