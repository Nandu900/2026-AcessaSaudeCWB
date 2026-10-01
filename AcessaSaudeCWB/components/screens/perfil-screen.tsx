"use client"

import { PageHeader } from "@/components/page-header"
import { User, Phone, Mail, MapPin, CreditCard } from "lucide-react"

interface PerfilScreenProps {
  onNavigate: (screen: string) => void
}

export function PerfilScreen({ onNavigate }: PerfilScreenProps) {
  return (
    <div className="h-full flex flex-col pb-20 bg-[linear-gradient(145deg,#1684b6_0%,#0aa9b2_52%,#08a779_100%)]">
      <PageHeader title="Perfil" onBack={() => onNavigate("home")} />
      <main className="flex-1 overflow-y-auto bg-transparent p-5">
        {/* Avatar & Name */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground text-lg">Joao Silva</h3>
              <p className="text-sm text-muted-foreground">Paciente cadastrado</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Informacoes pessoais
          </p>
          <div className="flex flex-col gap-4">
            <InfoRow icon={CreditCard} label="CPF" value="123.456.789-00" />
            <div className="h-px bg-border" />
            <InfoRow icon={Phone} label="Telefone" value="(41) 99999-9999" />
            <div className="h-px bg-border" />
            <InfoRow icon={Mail} label="Email" value="joao.silva@email.com" />
            <div className="h-px bg-border" />
            <InfoRow icon={MapPin} label="Bairro" value="Boqueirao, Curitiba" />
          </div>
        </div>
      </main>
    </div>
  )
}

interface InfoRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}

function InfoRow({ icon: Icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  )
}
