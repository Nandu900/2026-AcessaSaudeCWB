"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Thermometer, HeadsetIcon, Wind, CircleDot } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface QuickSymptom {
  label: string
  icon: LucideIcon
}

const quickSymptoms: QuickSymptom[] = [
  { label: "Febre", icon: Thermometer },
  { label: "Dor de cabeca", icon: HeadsetIcon },
  { label: "Tosse", icon: Wind },
  { label: "Dor abdominal", icon: CircleDot },
]

interface SintomasScreenProps {
  sintomas: string
  onUpdate: (sintomas: string) => void
  onNavigate: (screen: string) => void
}

export function SintomasScreen({ sintomas, onUpdate, onNavigate }: SintomasScreenProps) {
  const [selectedChips, setSelectedChips] = useState<string[]>([])

  const toggleChip = (label: string) => {
    const next = selectedChips.includes(label)
      ? selectedChips.filter((s) => s !== label)
      : [...selectedChips, label]
    setSelectedChips(next)

    const chipText = next.join(", ")
    const freeText = sintomas
      .split("\n")
      .filter((line) => !quickSymptoms.some((s) => line.includes(s.label)))
      .join("\n")
      .trim()

    const combined = [chipText, freeText].filter(Boolean).join("\n")
    onUpdate(combined)
  }

  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Sintomas" onBack={() => onNavigate("especialidade")} variant="success" />
      <main className="flex-1 overflow-y-auto p-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Descreva seus sintomas
          </p>

          {/* Quick Select Chips */}
          <div className="mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2.5">
              Selecao rapida
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSymptoms.map(({ label, icon: Icon }) => {
                const isSelected = selectedChips.includes(label)
                return (
                  <button
                    key={label}
                    onClick={() => toggleChip(label)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80"
                    }`}
                    aria-pressed={isSelected}
                    role="switch"
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Free text */}
          <label htmlFor="sintomas-text" className="block text-sm font-medium text-foreground mb-1.5">
            Detalhes adicionais
          </label>
          <textarea
            id="sintomas-text"
            rows={4}
            placeholder="Descreva como se sente, quando comecou, intensidade..."
            value={sintomas}
            onChange={(e) => onUpdate(e.target.value)}
            className="w-full px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none text-base"
          />
        </div>
        <button
          onClick={() => onNavigate("unidades")}
          className="w-full bg-success text-success-foreground font-bold py-4 rounded-xl mt-5 transition-all hover:bg-success/90 active:scale-[0.98] text-base"
        >
          Ver Unidades
        </button>
      </main>
    </div>
  )
}
