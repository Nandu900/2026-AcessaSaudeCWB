"use client"

import { CheckCircle2 } from "lucide-react"

interface ConfirmacaoScreenProps {
  nome: string
  especialidade: string
  unidade: string
  onNavigate: (screen: string) => void
}

export function ConfirmacaoScreen({ nome, especialidade, unidade, onNavigate }: ConfirmacaoScreenProps) {
  return (
    <div className="bg-background h-full flex flex-col p-5 pb-20">
      <main className="flex-1 min-h-0 flex items-center justify-center">
        <div className="bg-card rounded-3xl p-6 shadow-lg border border-border text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Agendado com Sucesso!</h1>
          <p className="text-muted-foreground text-sm mb-5">
            Seu atendimento foi registrado no sistema.
          </p>
          <div className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 p-4 mb-5 text-left">
            <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <p className="text-foreground text-sm leading-relaxed">
              Ao chegar, confirme sua presença no app. A equipe de saúde validará suas informações antes da consulta.
            </p>
          </div>
          <div className="bg-secondary rounded-xl p-4 mb-5 text-left text-sm border border-border">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Paciente</span>
                <span className="text-foreground font-semibold">{nome || "---"}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Especialidade</span>
                <span className="text-foreground font-semibold">{especialidade || "---"}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between">
                <span className="text-muted-foreground font-medium">Unidade</span>
                <span className="text-foreground font-semibold">{unidade || "---"}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate("home")}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all hover:bg-primary/90 active:scale-[0.98] text-base"
          >
            Voltar ao Inicio
          </button>
        </div>
      </main>
      <footer className="pt-3 text-center text-sm font-semibold text-muted-foreground">
        Chegue com 15 minutos de antecedência.
      </footer>
    </div>
  )
}
