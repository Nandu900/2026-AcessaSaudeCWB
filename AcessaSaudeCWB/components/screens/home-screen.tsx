"use client"

import { FileText, AlertTriangle, Clock, Bell } from "lucide-react"
import Image from "next/image"

interface HomeScreenProps {
  onNavigate: (screen: string) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
      {/* Top Bar */}
      <header className="px-5 pt-5 pb-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative w-[68px] h-[68px] overflow-hidden rounded-full bg-card shadow-sm shrink-0">
              <Image
                src="/acessasaudecwb_logo.png"
                alt="Símbolo AcessaSaudeCWB"
                width={168}
                height={168}
                className="absolute left-1/2 top-[-42px] max-w-none -translate-x-1/2"
              />
            </div>
            <div className="min-w-0">
              <h1 className="text-primary font-bold text-lg leading-tight">
                AcessaSaudeCWB
              </h1>
              <p className="text-accent text-xs font-semibold">
                Triagem Digital
              </p>
            </div>
          </div>
          <button
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors shrink-0"
            aria-label="Notificacoes"
          >
            <Bell className="w-5 h-5 text-primary" />
          </button>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="mx-5 mb-5 rounded-2xl bg-white px-5 py-4 shadow-sm">
        <h2 className="text-primary text-xl font-bold mb-1.5 text-balance">
          Bem-vindo(a) ao seu atendimento digital
        </h2>
        <p className="text-emerald-800 text-sm leading-relaxed">
          Menos burocracia, mais agilidade e atendimento prioritario.
        </p>
      </div>

      {/* Content Area */}
      <main className="flex-1 min-h-0 bg-transparent rounded-t-3xl px-5 pt-6 pb-24 overflow-y-auto">
        <div className="mb-4 flex items-center gap-3">
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-white/80" />
          <h2 className="text-lg font-bold text-white">Serviços</h2>
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-white/80" />
        </div>
        <div className="flex flex-col gap-4">
          <ActionCard
            icon={FileText}
            title="Novo Atendimento"
            subtitle="Agendar consulta ou triagem"
            onClick={() => onNavigate("novo")}
            variant="success"
          />
          <ActionCard
            icon={AlertTriangle}
            title="Urgência"
            subtitle="Atendimento imediato"
            onClick={() => onNavigate("urgencia")}
            variant="destructive"
          />
          <ActionCard
            icon={Clock}
            title="Acompanhar"
            subtitle="Ver posicao na fila"
            onClick={() => onNavigate("acompanhar")}
            variant="info"
          />
        </div>
      </main>
    </div>
  )
}

interface ActionCardProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  subtitle: string
  onClick: () => void
  variant: "success" | "destructive" | "info"
}

const variantStyles = {
  success: "bg-success hover:bg-success/90 text-success-foreground",
  destructive: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  info: "bg-primary hover:bg-primary/90 text-primary-foreground",
}

function ActionCard({ icon: Icon, title, subtitle, onClick, variant }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full min-h-[140px] rounded-2xl border-2 border-white p-4 shadow-md transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${variantStyles[variant]}`}
      aria-label={`${title}: ${subtitle}`}
    >
      <div className="flex items-center justify-between gap-4 text-left">
        <div className="min-w-0 flex-1 pl-2">
          <h3 className="font-bold text-xl leading-tight">{title}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed">{subtitle}</p>
        </div>
        <div className="mr-2 w-14 h-14 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </button>
  )
}
