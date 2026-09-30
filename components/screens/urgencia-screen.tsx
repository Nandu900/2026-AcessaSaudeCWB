"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { AlertTriangle, Send, Bot, UserIcon } from "lucide-react"

type UrgenciaStep = "form" | "chat" | "confirmed"

interface ChatMessage {
  sender: "bot" | "user"
  text: string
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    sender: "bot",
    text: "Ola! Sou o assistente de urgencia da AcessaSaudeCWB. Por favor, descreva brevemente a emergencia para que possamos priorizar seu atendimento.",
  },
]

interface UrgenciaScreenProps {
  onNavigate: (screen: string) => void
}

export function UrgenciaScreen({ onNavigate }: UrgenciaScreenProps) {
  const [step, setStep] = useState<UrgenciaStep>("form")
  const [nomeUrgencia, setNomeUrgencia] = useState("")
  const [telefoneUrgencia, setTelefoneUrgencia] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [currentMessage, setCurrentMessage] = useState("")

  const handleRegistrar = () => {
    setStep("chat")
  }

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return

    const userMsg: ChatMessage = { sender: "user", text: currentMessage.trim() }
    setMessages((prev) => [...prev, userMsg])
    setCurrentMessage("")

    // Simulated bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        sender: "bot",
        text: "Obrigado pela informacao. Sua urgencia foi classificada e a equipe foi notificada. Um profissional de saude entrara em contato em breve.",
      }
      setMessages((prev) => [...prev, botResponse])
      setTimeout(() => setStep("confirmed"), 1500)
    }, 1200)
  }

  // Confirmed state
  if (step === "confirmed") {
    return (
      <div className="bg-background h-full flex items-center justify-center p-5 pb-24">
        <div className="bg-card rounded-3xl p-8 shadow-lg border border-border text-center max-w-sm w-full">
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Urgencia Registrada</h1>
          <p className="text-muted-foreground text-sm mb-6">
            A equipe medica foi notificada e entrara em contato em instantes.
          </p>
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-destructive mb-1">Equipe Notificada</p>
            <p className="text-sm text-muted-foreground">
              Um tecnico de saude ligara em breve para {nomeUrgencia || "o paciente"}.
            </p>
          </div>
          <button
            onClick={() => {
              setStep("form")
              setMessages(INITIAL_MESSAGES)
              setNomeUrgencia("")
              setTelefoneUrgencia("")
              onNavigate("home")
            }}
            className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-xl transition-all hover:bg-primary/90 active:scale-[0.98] text-base"
          >
            Voltar ao Inicio
          </button>
        </div>
      </div>
    )
  }

  // Chat step
  if (step === "chat") {
    return (
      <div className="bg-background h-full flex flex-col pb-20">
        <PageHeader title="Assistente de Urgencia" onBack={() => setStep("form")} variant="destructive" />
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-destructive" />
                </div>
              )}
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-foreground rounded-bl-md"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "user" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="px-5 pb-5 pt-2 border-t border-border bg-background">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Descreva a emergencia..."
              className="flex-1 px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              aria-label="Mensagem sobre a emergencia"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim()}
              className="w-12 h-12 bg-destructive text-destructive-foreground rounded-xl flex items-center justify-center transition-all hover:bg-destructive/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              aria-label="Enviar mensagem"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Form step
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Urgencia" onBack={() => onNavigate("home")} variant="destructive" />
      <main className="flex-1 overflow-y-auto p-5">
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0" />
            <h3 className="font-bold text-destructive text-base">Atendimento de Urgencia</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Preencha os dados abaixo para registro imediato. Apos clicar em Registrar, voce sera direcionado ao assistente virtual.
          </p>
        </div>
        <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="urgencia-nome" className="block text-sm font-medium text-foreground mb-1.5">
                Nome do paciente
              </label>
              <input
                id="urgencia-nome"
                type="text"
                placeholder="Nome completo"
                value={nomeUrgencia}
                onChange={(e) => setNomeUrgencia(e.target.value)}
                className="w-full px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              />
            </div>
            <div>
              <label htmlFor="urgencia-tel" className="block text-sm font-medium text-foreground mb-1.5">
                Telefone de contato
              </label>
              <input
                id="urgencia-tel"
                type="tel"
                placeholder="(41) 99999-9999"
                value={telefoneUrgencia}
                onChange={(e) => setTelefoneUrgencia(e.target.value)}
                className="w-full px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleRegistrar}
          disabled={!nomeUrgencia.trim() || !telefoneUrgencia.trim()}
          className="w-full bg-destructive text-destructive-foreground font-bold py-4 rounded-xl mt-5 transition-all hover:bg-destructive/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          Registrar
        </button>
      </main>
    </div>
  )
}
