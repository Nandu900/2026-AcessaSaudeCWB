"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import {
  Star,
  Building2,
  UserCheck,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Github,
  PlayCircle,
  ExternalLink,
} from "lucide-react"

interface MaisScreenProps {
  onNavigate: (screen: string) => void
}

export function MaisScreen({ onNavigate }: MaisScreenProps) {
  const [subScreen, setSubScreen] = useState<"menu" | "avaliar" | "ok">("menu")
  const [avaliacao, setAvaliacao] = useState(0)
  const [comentario, setComentario] = useState("")

  // Thank you
  if (subScreen === "ok") {
    return (
      <div className="bg-background h-full flex items-center justify-center p-5 pb-24">
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Obrigado!</h1>
          <p className="text-muted-foreground text-sm mb-6">
            Sua avaliacao foi enviada com sucesso.
          </p>
          <button
            onClick={() => {
              setSubScreen("menu")
              setAvaliacao(0)
              setComentario("")
            }}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all hover:bg-primary/90 active:scale-[0.98] text-base"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  // Rate screen
  if (subScreen === "avaliar") {
    return (
      <div className="bg-background h-full flex flex-col pb-20">
        <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => setSubScreen("menu")}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Avaliar App</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <p className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-5">
              O que achou do AcessaSaudeCWB?
            </p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setAvaliacao(n)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95"
                  aria-label={`${n} estrela${n > 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-10 h-10 ${
                      avaliacao >= n
                        ? "text-warning fill-warning"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
            <label htmlFor="comentario" className="block text-sm font-medium text-foreground mb-1.5">
              Comentario (opcional)
            </label>
            <textarea
              id="comentario"
              rows={4}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Conte-nos sua experiencia..."
              className="w-full px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none text-base mb-4"
            />
            <button
              onClick={() => setSubScreen("ok")}
              disabled={avaliacao === 0}
              className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base mb-2"
            >
              Enviar Avaliacao
            </button>
            <button
              onClick={() => setSubScreen("menu")}
              className="w-full bg-secondary text-secondary-foreground font-semibold py-3 rounded-xl transition-all hover:bg-secondary/80 text-base"
            >
              Cancelar
            </button>
          </div>
        </main>
      </div>
    )
  }

  // Menu
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Mais Opcoes" onBack={() => onNavigate("home")} />
      <main className="flex-1 overflow-y-auto p-5">
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <MenuItem
            icon={Star}
            label="Avaliar App"
            onClick={() => setSubScreen("avaliar")}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={Building2}
            label="Avaliar Unidade"
            onClick={() => {}}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={UserCheck}
            label="Avaliar Profissional"
            onClick={() => {}}
          />
        </div>

        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-2 px-1">
          Sobre o Projeto
        </p>
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <MenuLink
            icon={Github}
            label="Código Fonte (GitHub)"
            href="https://github.com/Nandu900/AcessaSaudeCWB"
          />
          <div className="h-px bg-border mx-4" />
          <MenuLink
            icon={PlayCircle}
            label="Vídeo Demonstrativo (YouTube)"
            href="https://www.youtube.com/watch?v=SEU_VIDEO_ID"
          />
        </div>
      </main>
    </div>
  )
}

interface MenuItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: () => void
}

function MenuItem({ icon: Icon, label, onClick }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <span className="font-semibold text-foreground text-base">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  )
}

interface MenuLinkProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  href: string
}

function MenuLink({ icon: Icon, label, href }: MenuLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-muted-foreground" />
        <span className="font-semibold text-foreground text-base">{label}</span>
      </div>
      <ExternalLink className="w-4 h-4 text-muted-foreground" />
    </a>
  )
}
