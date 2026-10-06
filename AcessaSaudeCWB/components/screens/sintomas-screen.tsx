"use client"

import { PageHeader } from "@/components/page-header"

const quickSymptoms = [
  "Febre",
  "Dor de cabeça",
  "Tosse",
  "Dores intensas",
  "Problemas respiratórios",
  "Alergia",
  "Saúde mental",
]

interface SintomasScreenProps {
  sintomas: string[]
  observacoes: string
  onUpdate: (sintomas: string[], observacoes: string) => void
  onNavigate: (screen: string) => void
  teleatendimento: boolean
}

export function SintomasScreen({ sintomas, observacoes, onUpdate, onNavigate, teleatendimento }: SintomasScreenProps) {
  const selectedChips = sintomas

  const toggleChip = (label: string) => {
    const next = selectedChips.includes(label)
      ? selectedChips.filter((s) => s !== label)
      : [...selectedChips, label]

    onUpdate(next, observacoes)
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
              Seleção rápida
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSymptoms.map((label) => {
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
                  >
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
            placeholder="Descreva como se sente, quando começou, intensidade..."
            value={observacoes}
            onChange={(e) => onUpdate(sintomas, e.target.value)}
            className="w-full px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-none text-base"
          />
        </div>
        <button
          onClick={() => onNavigate(teleatendimento ? "horarios" : "unidades")}
          className="w-full bg-success text-success-foreground font-bold py-4 rounded-xl mt-5 transition-all hover:bg-success/90 active:scale-[0.98] text-base"
        >
          {teleatendimento ? "Escolher horário" : "Ver Unidades"}
        </button>
      </main>
    </div>
  )
}
