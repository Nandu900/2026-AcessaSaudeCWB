"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Clock, MapPin, Phone } from "lucide-react"

interface Unidade {
  id?: string | number
  nome: string
  tipo?: string
  endereco?: string
  bairro?: string
  telefone?: string
  horario?: string
  quantidadeAtendimentos?: number
}

interface UnidadesScreenProps {
  onSelect: (unidade: Unidade) => Promise<void>
  onNavigate: (screen: string) => void
}

export function UnidadesScreen({ onSelect, onNavigate }: UnidadesScreenProps) {
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectionError, setSelectionError] = useState("")
  const [selecting, setSelecting] = useState("")

  useEffect(() => {
    let active = true

    fetch("/api/planilhas?action=unidades")
      .then(async (response) => {
        const result = await response.json()
        if (!response.ok || !result.ok) throw new Error(result.error || "Não foi possível carregar as unidades.")
        if (active) setUnidades(Array.isArray(result.data) ? result.data : [])
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Não foi possível carregar as unidades.")
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const selecionarUnidade = async (unidade: Unidade) => {
    setSelecting(unidade.nome)
    setSelectionError("")
    try {
      await onSelect(unidade)
    } catch (selectionFailure: unknown) {
      setSelectionError(selectionFailure instanceof Error ? selectionFailure.message : "Não foi possível registrar o atendimento.")
    } finally {
      setSelecting("")
    }
  }

  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Unidades Disponiveis" onBack={() => onNavigate("sintomas")} variant="success" />
      <main className="flex-1 overflow-y-auto p-5">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Selecione uma unidade
        </p>
        {loading ? (
          <p role="status" className="rounded-2xl bg-white p-5 text-sm text-muted-foreground">Carregando unidades...</p>
        ) : error ? (
          <p role="alert" className="rounded-2xl border border-destructive/20 bg-white p-5 text-sm text-destructive">{error}</p>
        ) : unidades.length === 0 ? (
          <p className="rounded-2xl bg-white p-5 text-sm text-muted-foreground">Nenhuma unidade cadastrada na planilha.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {unidades.map((unidade) => (
              <button
                key={unidade.id || unidade.nome}
                onClick={() => void selecionarUnidade(unidade)}
                disabled={Boolean(selecting)}
                className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="font-bold text-foreground text-base">{unidade.nome}</h3>
                  {unidade.tipo && <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{unidade.tipo}</span>}
                </div>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {(unidade.endereco || unidade.bairro) && (
                    <div className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{[unidade.endereco, unidade.bairro].filter(Boolean).join(" · ")}</span>
                    </div>
                  )}
                  {unidade.telefone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /><span>{unidade.telefone}</span></div>}
                  {unidade.horario && <div className="flex items-center gap-2"><Clock className="h-4 w-4 shrink-0" /><span>{unidade.horario}</span></div>}
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    {unidade.quantidadeAtendimentos ?? 0} {(unidade.quantidadeAtendimentos ?? 0) === 1 ? "atendimento" : "atendimentos"}
                  </span>
                </div>
                {selecting === unidade.nome && <span className="mt-3 block text-xs font-semibold text-primary">Registrando atendimento...</span>}
              </button>
            ))}
          </div>
        )}
        {selectionError && <p role="alert" className="mt-4 rounded-xl border border-destructive/20 bg-white p-4 text-sm text-destructive">{selectionError}</p>}
      </main>
    </div>
  )
}
