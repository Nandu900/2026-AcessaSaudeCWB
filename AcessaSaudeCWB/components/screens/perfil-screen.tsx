"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Mail, UserRound, UserRoundX } from "lucide-react"

interface PerfilScreenProps {
  nome: string
  email: string
  telefone: string
  onUpdate: (dados: { nome?: string; email?: string; telefone?: string }) => void
  onSave: () => Promise<void>
  onClear: () => void
  onNavigate: (screen: string) => void
}

export function PerfilScreen({ nome, email, telefone, onUpdate, onSave, onClear, onNavigate }: PerfilScreenProps) {
  const [mensagem, setMensagem] = useState("")

  const salvar = async () => {
    setMensagem("")
    try {
      await onSave()
      setMensagem("Dados guardados nesta sessão e acesso registrado na planilha.")
    } catch (error) {
      setMensagem(error instanceof Error
        ? `Dados guardados nesta sessão. Não foi possível registrar o acesso: ${error.message}`
        : "Dados guardados nesta sessão, mas o acesso não foi registrado na planilha.")
    }
  }

  const limparPerfil = () => {
    onClear()
    setMensagem("")
  }

  return (
    <div className="h-full flex flex-col pb-20 bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
      <PageHeader title="Perfil" onBack={() => onNavigate("home")} />
      <main className="flex-1 overflow-y-auto bg-transparent p-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <UserRound className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Dados do perfil</h2>
              <p className="text-xs text-muted-foreground">Guardados nesta aba do navegador</p>
            </div>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Estes dados serão usados para preencher seus próximos atendimentos nesta sessão.
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="perfil-nome" className="mb-1.5 block text-sm font-medium text-foreground">Nome</label>
              <input
                id="perfil-nome"
                type="text"
                autoComplete="name"
                value={nome}
                onChange={(event) => {
                  onUpdate({ nome: event.target.value })
                  setMensagem("")
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Seu nome"
              />
            </div>
            <div>
              <label htmlFor="perfil-email" className="mb-1.5 block text-sm font-medium text-foreground">E-mail</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="perfil-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    onUpdate({ email: event.target.value })
                    setMensagem("")
                  }}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="voce@exemplo.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="perfil-telefone" className="mb-1.5 block text-sm font-medium text-foreground">Telefone</label>
              <input
                id="perfil-telefone"
                type="tel"
                autoComplete="tel"
                value={telefone}
                onChange={(event) => {
                  onUpdate({ telefone: event.target.value })
                  setMensagem("")
                }}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="(41) 99999-9999"
              />
            </div>
          </div>
          {mensagem && <p role="status" className="mt-4 text-sm font-medium text-foreground">{mensagem}</p>}
          <button
            type="button"
            disabled={!nome.trim() || !email.trim() || !telefone.trim()}
            onClick={salvar}
            className="mt-5 w-full rounded-xl bg-primary py-3.5 font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Salvar perfil
          </button>
          <button
            type="button"
            onClick={limparPerfil}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary"
          >
            <UserRoundX className="h-4 w-4" />
            Trocar pessoa
          </button>
        </div>
      </main>
    </div>
  )
}
