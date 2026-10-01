"use client"

import { PageHeader } from "@/components/page-header"

interface DadosPaciente {
  nome: string
  telefone: string
  email: string
  bairro: string
}

interface NovoAtendimentoScreenProps {
  dados: DadosPaciente
  onUpdate: (dados: Partial<DadosPaciente>) => void
  onNavigate: (screen: string) => void
}

export function NovoAtendimentoScreen({ dados, onUpdate, onNavigate }: NovoAtendimentoScreenProps) {
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Novo Atendimento" onBack={() => onNavigate("home")} variant="success" />
      <main className="flex-1 overflow-y-auto p-5">
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Dados do Paciente
          </p>
          <div className="flex flex-col gap-3">
            <FormInput
              label="Nome completo"
              type="text"
              value={dados.nome}
              onChange={(v) => onUpdate({ nome: v })}
              placeholder="Digite seu nome completo"
            />
            <FormInput
              label="Telefone"
              type="tel"
              value={dados.telefone}
              onChange={(v) => onUpdate({ telefone: v })}
              placeholder="(41) 99999-9999"
            />
            <FormInput
              label="Email"
              type="email"
              value={dados.email}
              onChange={(v) => onUpdate({ email: v })}
              placeholder="seu@email.com"
              required
            />
            <FormInput
              label="Bairro"
              type="text"
              value={dados.bairro}
              onChange={(v) => onUpdate({ bairro: v })}
              placeholder="Seu bairro em Curitiba"
            />
          </div>
        </div>
        <button
          onClick={() => onNavigate("especialidade")}
          disabled={!dados.nome.trim() || !dados.email.trim()}
          className="w-full bg-success text-success-foreground font-bold py-4 rounded-xl mt-5 transition-all hover:bg-success/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          Continuar
        </button>
      </main>
    </div>
  )
}

interface FormInputProps {
  label: string
  type: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  required?: boolean
}

function FormInput({ label, type, value, onChange, placeholder, required = false }: FormInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3.5 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all text-base"
      />
    </div>
  )
}
