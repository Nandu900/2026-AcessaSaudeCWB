"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { AlertTriangle, Send, Bot, UserIcon } from "lucide-react"

type UrgenciaStep = "form" | "chat" | "confirmed"
type ChatStage = "description" | "assistance" | "special-care" | "complete"

interface ChatMessage {
  sender: "bot" | "user"
  text: string
}

interface TriagePayload {
  nome: string
  email: string
  sintomas: string
  observacoes: string
  ambulancia: string
  cuidadosEspeciais: string
  unidade: string
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    sender: "bot",
    text: "Olá! Sou o assistente de urgência da AcessaSaudeCWB. Descreva brevemente o que está acontecendo.",
  },
]

interface UrgenciaScreenProps {
  nome: string
  email: string
  telefone: string
  onRegister: (triagem: TriagePayload) => Promise<void>
  onNavigate: (screen: string) => void
}

export function UrgenciaScreen({ nome, email, telefone, onRegister, onNavigate }: UrgenciaScreenProps) {
  const [step, setStep] = useState<UrgenciaStep>("form")
  const [nomeUrgencia, setNomeUrgencia] = useState(nome)
  const [emailUrgencia, setEmailUrgencia] = useState(email)
  const [telefoneUrgencia, setTelefoneUrgencia] = useState(telefone)
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const [currentMessage, setCurrentMessage] = useState("")
  const [descricao, setDescricao] = useState("")
  const [chatStage, setChatStage] = useState<ChatStage>("description")
  const [replyPending, setReplyPending] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registrationError, setRegistrationError] = useState("")
  const [pendingTriage, setPendingTriage] = useState<TriagePayload | null>(null)
  const [needsAmbulance, setNeedsAmbulance] = useState(false)
  const [specialCare, setSpecialCare] = useState("")

  const registrarTriagem = async (ambulancia: boolean, cuidadosEspeciais = "") => {
    const triagem: TriagePayload = {
      nome: nomeUrgencia.trim(),
      email: emailUrgencia.trim().toLowerCase(),
      sintomas: descricao,
      observacoes: cuidadosEspeciais,
      ambulancia: ambulancia ? "Sim" : "Não",
      cuidadosEspeciais,
      unidade: "",
    }

    setPendingTriage(triagem)
    setRegistrationError("")
    setRegistering(true)
    try {
      await onRegister(triagem)
      setStep("confirmed")
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : "Não foi possível registrar a triagem.")
    } finally {
      setRegistering(false)
    }
  }

  const handleRegistrar = () => {
    setStep("chat")
  }

  const handleSendMessage = () => {
    const messageText = currentMessage.trim()
    if (!messageText || replyPending || chatStage === "assistance") return

    setMessages((prev) => [...prev, { sender: "user", text: messageText }])
    setCurrentMessage("")
    setReplyPending(true)
    if (chatStage === "description") setDescricao(messageText)

    setTimeout(() => {
      if (chatStage === "description") {
        setMessages((prev) => [...prev, {
          sender: "bot",
          text: "Você precisa de ambulância ou de algum cuidado especial ao chegar à unidade?",
        }])
        setChatStage("assistance")
      } else {
        setSpecialCare(messageText)
        setMessages((prev) => [...prev, {
          sender: "bot",
          text: "Registrando a triagem com essa informação.",
        }])
        setChatStage("complete")
        void registrarTriagem(needsAmbulance, messageText)
      }
      setReplyPending(false)
    }, 700)
  }

  const chooseAmbulance = () => {
    setNeedsAmbulance(true)
    setMessages((prev) => [...prev, { sender: "user", text: "Preciso de ambulância." }])
    setChatStage("complete")
    void registrarTriagem(true, specialCare)
  }

  const chooseSpecialCare = () => {
    setMessages((prev) => [...prev,
      { sender: "user", text: "Preciso de cuidados especiais." },
      { sender: "bot", text: "Quais cuidados especiais você precisa ao chegar à unidade?" },
    ])
    setChatStage("special-care")
  }

  const chooseNoAdditionalCare = () => {
    setMessages((prev) => [...prev, { sender: "user", text: "Não preciso de ambulância ou cuidados especiais." }])
    setChatStage("complete")
    void registrarTriagem(false, specialCare)
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
          <p className="text-muted-foreground text-sm mb-4">
            Triagem registrada na planilha. Nenhuma equipe foi notificada automaticamente.
          </p>
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 mb-6 text-left">
            {needsAmbulance ? (
              <p className="text-sm font-semibold text-destructive mb-2">
                Este aplicativo não aciona ambulâncias. Para solicitar socorro, ligue 192 (SAMU).
              </p>
            ) : specialCare ? (
              <p className="text-sm text-foreground mb-2">
                <span className="font-semibold">Cuidado especial informado:</span> {specialCare}
              </p>
            ) : null}
            <p className="text-sm font-semibold text-destructive">
              Se houver risco imediato, ligue 192 (SAMU) ou procure o serviço de emergência mais próximo.
            </p>
          </div>
          <button
            onClick={() => {
              setStep("form")
              setMessages(INITIAL_MESSAGES)
              setChatStage("description")
              setNeedsAmbulance(false)
              setSpecialCare("")
              setDescricao("")
              setPendingTriage(null)
              setRegistrationError("")
              setNomeUrgencia(nome)
              setEmailUrgencia(email)
              setTelefoneUrgencia(telefone)
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
          {chatStage === "assistance" && (
            <div className="ml-10 grid gap-2">
              <button
                type="button"
                onClick={chooseAmbulance}
                className="rounded-xl border border-destructive/30 bg-card px-4 py-3 text-left text-sm font-semibold text-destructive hover:bg-destructive/5"
              >
                Preciso de ambulância
              </button>
              <button
                type="button"
                onClick={chooseSpecialCare}
                className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Preciso de cuidados especiais
              </button>
              <button
                type="button"
                onClick={chooseNoAdditionalCare}
                className="rounded-xl border border-border bg-card px-4 py-3 text-left text-sm font-semibold text-foreground hover:bg-secondary"
              >
                Não preciso
              </button>
            </div>
          )}
          {registering && (
            <p role="status" className="ml-10 text-sm text-muted-foreground">Registrando triagem...</p>
          )}
          {registrationError && (
            <div role="alert" className="ml-10 rounded-xl border border-destructive/20 bg-card p-3 text-sm text-destructive">
              <p>{registrationError}</p>
              {pendingTriage && (
                <button
                  type="button"
                  disabled={registering}
                  onClick={() => {
                    setRegistrationError("")
                    setRegistering(true)
                    void onRegister(pendingTriage)
                      .then(() => setStep("confirmed"))
                      .catch((error: unknown) => setRegistrationError(error instanceof Error ? error.message : "Não foi possível registrar a triagem."))
                      .finally(() => setRegistering(false))
                  }}
                  className="mt-2 font-semibold underline disabled:opacity-50"
                >
                  Tentar novamente
                </button>
              )}
            </div>
          )}
        </div>
        <div className="px-5 pb-5 pt-2 border-t border-border bg-background">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={replyPending || registering || chatStage === "assistance" || chatStage === "complete"}
              placeholder={chatStage === "special-care" ? "Quais cuidados especiais?" : "Descreva a emergência..."}
              className="flex-1 px-4 py-3.5 bg-input border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-base"
              aria-label="Mensagem sobre a emergencia"
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || replyPending || registering || chatStage === "assistance" || chatStage === "complete"}
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
          <p className="text-sm font-semibold text-destructive mt-3">
            Este formulário não solicita ambulância. Em caso de emergência, ligue 192 (SAMU).
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
              <label htmlFor="urgencia-email" className="block text-sm font-medium text-foreground mb-1.5">
                E-mail
              </label>
              <input
                id="urgencia-email"
                type="email"
                placeholder="voce@exemplo.com"
                value={emailUrgencia}
                onChange={(e) => setEmailUrgencia(e.target.value)}
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
          disabled={!nomeUrgencia.trim() || !emailUrgencia.trim() || !telefoneUrgencia.trim()}
          className="w-full bg-destructive text-destructive-foreground font-bold py-4 rounded-xl mt-5 transition-all hover:bg-destructive/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-base"
        >
          Registrar
        </button>
      </main>
    </div>
  )
}
