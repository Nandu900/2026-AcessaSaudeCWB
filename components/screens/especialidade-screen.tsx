"use client"

import { PageHeader } from "@/components/page-header"
import { Stethoscope, Baby, HeartPulse, Syringe, SmilePlus, Brain } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface EspecialidadeItem {
  name: string
  icon: LucideIcon
}

const especialidades: EspecialidadeItem[] = [
  { name: "Clinico Geral", icon: Stethoscope },
  { name: "Pediatria", icon: Baby },
  { name: "Ginecologia", icon: HeartPulse },
  { name: "Enfermagem", icon: Syringe },
  { name: "Odontologia", icon: SmilePlus },
  { name: "Psicologia", icon: Brain },
]

interface EspecialidadeScreenProps {
  onSelect: (especialidade: string) => void
  onNavigate: (screen: string) => void
}

export function EspecialidadeScreen({ onSelect, onNavigate }: EspecialidadeScreenProps) {
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Especialidade" onBack={() => onNavigate("novo")} variant="success" />
      <main className="flex-1 overflow-y-auto p-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Selecione a especialidade
          </p>
          <div className="flex flex-col gap-2.5">
            {especialidades.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => {
                  onSelect(name)
                  onNavigate("sintomas")
                }}
                className="w-full flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 rounded-xl text-left transition-all active:scale-[0.98] border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-foreground text-base">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
