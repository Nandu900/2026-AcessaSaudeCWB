"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { ArrowRight, ClipboardCheck, Clock3, Stethoscope } from "lucide-react"

type Stage = "triagem" | "validado" | "atendimento" | "concluido"
type CaseType = "Agendamento" | "Urgência"

interface DemoCase {
  id: string
  paciente: string
  tipo: CaseType
  unidade: string
  resumo: string
  criado: string
  stage: Stage
}

const stageOrder: Stage[] = ["triagem", "validado", "atendimento", "concluido"]

const stageLabels: Record<Stage, string> = {
  triagem: "Triagem",
  validado: "Validado",
  atendimento: "Atendimento",
  concluido: "Concluído",
}

const initialCases: DemoCase[] = [
  {
    id: "DEMO-1024",
    paciente: "Ana Martins",
    tipo: "Agendamento",
    unidade: "US Abaeté",
    resumo: "Consulta de clínica geral. Relata dor de cabeça leve há dois dias.",
    criado: "09:15",
    stage: "triagem",
  },
  {
    id: "DEMO-1025",
    paciente: "Carlos Souza",
    tipo: "Urgência",
    unidade: "UPA Boa Vista",
    resumo: "Relata dores intensas e necessidade de apoio ao chegar à unidade.",
    criado: "09:28",
    stage: "triagem",
  },
]

const nextActions: Partial<Record<Stage, string>> = {
  triagem: "Validar informações",
  validado: "Iniciar atendimento",
  atendimento: "Concluir demonstração",
}

interface EquipeScreenProps {
  onNavigate: (screen: string) => void
}

export function EquipeScreen({ onNavigate }: EquipeScreenProps) {
  const [cases, setCases] = useState(initialCases)
  const [activeStage, setActiveStage] = useState<Stage>("triagem")
  const visibleCases = cases.filter((item) => item.stage === activeStage)

  const advanceCase = (id: string) => {
    setCases((currentCases) => currentCases.map((item) => {
      if (item.id !== id) return item
      const currentIndex = stageOrder.indexOf(item.stage)
      const nextStage = stageOrder[currentIndex + 1]
      return nextStage ? { ...item, stage: nextStage } : item
    }))
  }

  return (
    <div className="h-full flex flex-col pb-20 bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
      <PageHeader title="Equipe de Saúde" onBack={() => onNavigate("mais")} />
      <main className="flex-1 overflow-y-auto bg-transparent p-5">
        <div className="mb-4 rounded-2xl border border-white/70 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase text-primary">Painel demonstrativo</p>
          <p className="mt-1 text-sm text-muted-foreground">Dois casos fictícios para visualizar as etapas do atendimento.</p>
        </div>

        <div className="mb-4 grid grid-cols-4 gap-1 rounded-xl border border-white/70 bg-white p-1">
          {stageOrder.map((stage) => {
            const count = cases.filter((item) => item.stage === stage).length
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setActiveStage(stage)}
                aria-pressed={activeStage === stage}
                className={`rounded-lg px-1 py-2 text-center text-[11px] font-semibold transition-colors ${activeStage === stage ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
              >
                <span className="block">{stageLabels[stage]}</span>
                <span className="block text-xs">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3">
          {visibleCases.length === 0 ? (
            <div className="rounded-2xl border border-white/70 bg-white p-5 text-center text-sm text-muted-foreground">
              Nenhum caso nesta etapa da demonstração.
            </div>
          ) : visibleCases.map((item) => (
            <article key={item.id} className="rounded-2xl border border-white/70 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${item.tipo === "Urgência" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}>
                    {item.tipo}
                  </span>
                  <h2 className="mt-2 font-bold text-foreground">{item.paciente}</h2>
                </div>
                <span className="text-xs font-medium text-muted-foreground">{item.id}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <Stethoscope className="h-4 w-4" />
                {item.unidade}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.resumo}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                Recebido às {item.criado}
              </div>
              {nextActions[item.stage] ? (
                <button
                  type="button"
                  onClick={() => advanceCase(item.id)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ClipboardCheck className="h-4 w-4" />
                  {nextActions[item.stage]}
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <p className="mt-4 rounded-xl bg-success/10 px-4 py-3 text-center text-sm font-semibold text-success">
                  Fluxo demonstrativo concluído
                </p>
              )}
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}