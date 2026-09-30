"use client"

import { FileText, AlertTriangle, Clock, Bell, Shield } from "lucide-react"

interface HomeScreenProps {
  onNavigate: (screen: string) => void
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="flex flex-col h-full bg-primary">
      {/* Top Bar */}
      <header className="px-5 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-card rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-primary-foreground font-bold text-base tracking-tight">
              AcessaSaudeCWB
            </h1>
            <p className="text-primary-foreground/60 text-xs font-medium">
              Triagem Digital
            </p>
          </div>
        </div>
        <button
          className="w-10 h-10 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
          aria-label="Notificacoes"
        >
          <Bell className="w-5 h-5 text-primary-foreground" />
        </button>
      </header>

      {/* Welcome Banner */}
      <div className="px-5 pb-6">
        <h2 className="text-primary-foreground text-xl font-bold mb-1.5 text-balance">
          Bem-vindo(a) ao seu atendimento digital
        </h2>
        <p className="text-primary-foreground/70 text-sm leading-relaxed">
          Menos burocracia, mais agilidade e atendimento prioritario.
        </p>
      </div>

      {/* Content Area */}
      <main className="flex-1 bg-background rounded-t-3xl px-5 pt-6 pb-24 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
          Servicos
        </p>
        <div className="flex flex-col gap-3">
          <ActionCard
            icon={FileText}
            title="Novo Atendimento"
            subtitle="Agendar consulta ou triagem"
            onClick={() => onNavigate("novo")}
            variant="success"
          />
          <ActionCard
            icon={AlertTriangle}
            title="Urgencia"
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
      className={`w-full rounded-2xl p-5 shadow-sm transition-all active:scale-[0.98] ${variantStyles[variant]}`}
      aria-label={`${title}: ${subtitle}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-foreground/10 p-3 rounded-xl shrink-0">
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-base">{title}</h3>
          <p className="text-sm opacity-80 font-medium">{subtitle}</p>
        </div>
      </div>
    </button>
  )
}
