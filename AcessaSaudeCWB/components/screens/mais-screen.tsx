"use client"

import { PageHeader } from "@/components/page-header"
import {
  Star,
  Building2,
  UserCheck,
  ChevronRight,
  Github,
  PlayCircle,
  ExternalLink,
  LogOut,
} from "lucide-react"

interface MaisScreenProps {
  onNavigate: (screen: string) => void
  onSignOut: () => void
}

export function MaisScreen({ onNavigate, onSignOut }: MaisScreenProps) {
  // Menu
  return (
    <div className="h-full flex flex-col pb-20 bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
      <PageHeader title="Mais Opcoes" onBack={() => onNavigate("home")} />
      <main className="flex-1 overflow-y-auto bg-transparent p-5">
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <MenuLink
            icon={Star}
            label="Avaliar App"
            href="https://forms.gle/WZCpLEdoxZgDL1Mp9"
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={Building2}
            label="Cadastrar Unidade"
            onClick={() => {}}
          />
          <div className="h-px bg-border mx-4" />
          <MenuItem
            icon={UserCheck}
            label="Visualização da Equipe de Saúde"
            onClick={() => {}}
          />
        </div>

        <p className="text-xs font-semibold text-white uppercase tracking-wider mt-6 mb-2 px-1">
          Sobre o Projeto
        </p>
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <MenuLink
            icon={Github}
            label="Código Fonte (GitHub)"
            href="https://github.com/Nandu900/2026-AcessaSaudeCWB"
          />
          <div className="h-px bg-border mx-4" />
          <MenuLink
            icon={PlayCircle}
            label="Vídeo Demonstrativo (YouTube)"
            href="https://www.youtube.com/watch?v=SEU_VIDEO_ID"
          />
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="mt-5 flex w-full items-center gap-3 rounded-xl border border-white/70 bg-white px-4 py-3 text-left text-sm font-semibold text-destructive shadow-sm transition-colors hover:bg-white/90"
        >
          <LogOut className="h-5 w-5" />
          Sair da conta
        </button>
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
