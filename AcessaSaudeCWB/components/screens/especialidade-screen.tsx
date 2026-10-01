"use client"

import { PageHeader } from "@/components/page-header"
import { Stethoscope, Baby, HeartPulse, Syringe, Brain, Video } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type EspecialidadeIcon = LucideIcon | "tooth"

interface EspecialidadeItem {
  name: string
  icon: EspecialidadeIcon
}

const especialidades: EspecialidadeItem[] = [
  { name: "Clinico Geral", icon: Stethoscope },
  { name: "Pediatria", icon: Baby },
  { name: "Ginecologia", icon: HeartPulse },
  { name: "Enfermagem", icon: Syringe },
  { name: "Odontologia", icon: "tooth" },
  { name: "Psicologia", icon: Brain },
  { name: "Teleatendimento", icon: Video },
]

interface EspecialidadeScreenProps {
  onSelect: (especialidade: string) => void
  onNavigate: (screen: string) => void
}

export function EspecialidadeScreen({ onSelect, onNavigate }: EspecialidadeScreenProps) {
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Especialidades" onBack={() => onNavigate("novo")} variant="success" />
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
                  {Icon === "tooth" ? (
                    <ToothIcon className="w-5 h-5 text-primary" />
                  ) : (
                    <Icon className="w-5 h-5 text-primary" />
                  )}
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

function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.7 3.4c1.7 0 3.2 1 4.3 2 1.1-1 2.6-2 4.3-2 3 0 4.7 2.4 4 5.8-.5 2.3-1.6 4-2.2 6.2-.5 1.8-.8 5.2-2.1 5.2-1.2 0-1.1-4.1-2.5-4.1s-1.3 4.1-2.5 4.1c-1.3 0-1.6-3.4-2.1-5.2-.6-2.2-1.7-3.9-2.2-6.2-.7-3.4 1-5.8 4-5.8Z" />
    </svg>
  )
}
