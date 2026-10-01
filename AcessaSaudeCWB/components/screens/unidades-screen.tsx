"use client"

import { PageHeader } from "@/components/page-header"
import { Clock, MapPin, Users } from "lucide-react"

interface Unidade {
  nome: string
  distancia: string
  tempoEspera: string
  pacientesNaFila: number
}

const unidades: Unidade[] = [
  { nome: "UBS Boqueirao", distancia: "1.2 km", tempoEspera: "~30 min", pacientesNaFila: 8 },
  { nome: "UPA Sitio Cercado", distancia: "2.5 km", tempoEspera: "~45 min", pacientesNaFila: 15 },
  { nome: "UBS Campo Comprido", distancia: "3.8 km", tempoEspera: "~20 min", pacientesNaFila: 4 },
]

interface UnidadesScreenProps {
  onSelect: (unidade: string) => void
  onNavigate: (screen: string) => void
}

export function UnidadesScreen({ onSelect, onNavigate }: UnidadesScreenProps) {
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Unidades Disponiveis" onBack={() => onNavigate("sintomas")} variant="success" />
      <main className="flex-1 overflow-y-auto p-5">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Selecione uma unidade
        </p>
        <div className="flex flex-col gap-3">
          {unidades.map((u) => (
            <button
              key={u.nome}
              onClick={() => onSelect(u.nome)}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-all hover:shadow-md active:scale-[0.98] w-full"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-foreground text-base">{u.nome}</h3>
                <span className="text-primary font-bold text-xs bg-primary/10 px-2.5 py-1 rounded-full shrink-0 ml-2">
                  {u.distancia}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{u.tempoEspera}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>{u.pacientesNaFila} na fila</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Aberto</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}
