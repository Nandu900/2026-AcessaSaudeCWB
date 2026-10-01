"use client"

import { useEffect, useState } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { HomeScreen } from "@/components/screens/home-screen"
import { NovoAtendimentoScreen } from "@/components/screens/novo-atendimento-screen"
import { EspecialidadeScreen } from "@/components/screens/especialidade-screen"
import { SintomasScreen } from "@/components/screens/sintomas-screen"
import { HorariosScreen } from "@/components/screens/horarios-screen"
import { UrgenciaScreen } from "@/components/screens/urgencia-screen"
import { UnidadesScreen } from "@/components/screens/unidades-screen"
import { ConfirmacaoScreen } from "@/components/screens/confirmacao-screen"
import { AcompanharScreen } from "@/components/screens/acompanhar-screen"
import { SaudeScreen } from "@/components/screens/saude-screen"
import { MaisScreen } from "@/components/screens/mais-screen"
import { PerfilScreen } from "@/components/screens/perfil-screen"

// Interface atualizada conforme os campos do seu formulário
interface DadosPaciente {
  nome: string
  cpf: string
  telefone: string
  email: string
  bairro: string
  especialidade: string
  sintomas: string[]
  urgencia: string
  unidade: string
}

const initialDados: DadosPaciente = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  bairro: "",
  especialidade: "",
  sintomas: [],
  urgencia: "",
  unidade: "",
}

const SCREENS_WITH_NAV = new Set(["home", "acompanhar", "saude", "mais"])

async function enviarParaPlanilhas(payload: Record<string, unknown>) {
  const response = await fetch("/api/planilhas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (!response.ok || !result.ok) {
    throw new Error(result.error || "Não foi possível salvar na planilha.")
  }
}
const PROFILE_SESSION_KEY = "acessa-saude-profile"

export default function App() {
  const [tela, setTela] = useState("home")
  const [dados, setDados] = useState<DadosPaciente>(initialDados)
  const [profileReady, setProfileReady] = useState(false)

  useEffect(() => {
    try {
      const savedProfile = window.sessionStorage.getItem(PROFILE_SESSION_KEY)
      if (savedProfile) {
        const profile = JSON.parse(savedProfile) as Pick<DadosPaciente, "nome" | "email" | "telefone">
        setDados((current) => ({
          ...current,
          nome: profile.nome ?? "",
          email: profile.email ?? "",
          telefone: profile.telefone ?? "",
        }))
      }
    } catch {
      window.sessionStorage.removeItem(PROFILE_SESSION_KEY)
    }
    setProfileReady(true)
  }, [])

  useEffect(() => {
    if (!profileReady) return
    try {
      window.sessionStorage.setItem(PROFILE_SESSION_KEY, JSON.stringify({
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
      }))
    } catch (error) {
      console.error("Não foi possível salvar o perfil nesta sessão:", error)
    }
  }, [dados.nome, dados.email, dados.telefone, profileReady])

  const updateDados = (partial: Partial<DadosPaciente>) => {
    setDados((prev) => ({ ...prev, ...partial }))
  }

  const trocarPessoa = () => {
    window.sessionStorage.removeItem(PROFILE_SESSION_KEY)
    setDados(initialDados)
  }

  const navigate = (screen: string) => {
    setTela(screen)
  }

  const renderScreen = () => {
    switch (tela) {
      case "home":
        return <HomeScreen onNavigate={navigate} />
      case "novo":
        return (
          <NovoAtendimentoScreen
            dados={dados}
            onUpdate={updateDados}
            onNavigate={navigate}
          />
        )
      case "especialidade":
        return (
          <EspecialidadeScreen
            onSelect={(esp) => updateDados({ especialidade: esp })}
            onNavigate={navigate}
          />
        )
      case "sintomas":
        return (
          <SintomasScreen
            sintomas={dados.sintomas.join("\n")}
            onUpdate={(sintomasText) => {
              const sintomasArray = sintomasText.split("\n").filter(Boolean)
              updateDados({ sintomas: sintomasArray })
            }}
            onNavigate={navigate}
            teleatendimento={dados.especialidade === "Teleatendimento"}
          />
        )
      case "horarios":
        return (
          <HorariosScreen
            nome={dados.nome}
            email={dados.email}
            onRegister={({ data, horario }) => enviarParaPlanilhas({
              action: "appointment",
              nome: dados.nome,
              email: dados.email,
              especialidade: dados.especialidade,
              unidade: "Teleatendimento",
              dataConsulta: data,
              horario,
              status: "Solicitado",
            })}
            onNavigate={navigate}
          />
        )
      case "urgencia":
        return (
          <UrgenciaScreen
            nome={dados.nome}
            email={dados.email}
            telefone={dados.telefone}
            onRegister={(triagem) => enviarParaPlanilhas({ action: "triage", ...triagem })}
            onNavigate={navigate}
          />
        )
      case "unidades":
        return (
          <UnidadesScreen
            onSelect={async (unidade) => {
              await enviarParaPlanilhas({
                action: "appointment",
                nome: dados.nome,
                email: dados.email,
                especialidade: dados.especialidade,
                unidade,
                dataConsulta: "",
                horario: "",
                status: "Solicitado",
              })
              updateDados({ unidade })
              navigate("confirmacao")
            }}
            onNavigate={navigate}
          />
        )
      case "confirmacao":
        return (
          <ConfirmacaoScreen
            nome={dados.nome}
            especialidade={dados.especialidade}
            unidade={dados.unidade}
            onNavigate={(screen) => {
              if (screen === "home") {
                setDados((current) => ({
                  ...initialDados,
                  nome: current.nome,
                  email: current.email,
                }))
              }
              navigate(screen)
            }}
          />
        )
      case "acompanhar":
        return <AcompanharScreen email={dados.email} onNavigate={navigate} />
      case "saude":
        return <SaudeScreen onNavigate={navigate} />
      case "mais":
        return <MaisScreen onNavigate={navigate} />
      case "perfil":
        return (
          <PerfilScreen
            nome={dados.nome}
            email={dados.email}
            telefone={dados.telefone}
            onUpdate={updateDados}
            onSave={() => enviarParaPlanilhas({
              action: "access",
              nome: dados.nome,
              email: dados.email,
              usuarioId: dados.telefone,
              evento: "Perfil informado",
            })}
            onClear={trocarPessoa}
            onNavigate={navigate}
          />
        )
      default:
        return <HomeScreen onNavigate={navigate} />
    }
  }

  if (!profileReady) {
    return (
      <main className="min-h-dvh flex items-center justify-center bg-background text-sm text-muted-foreground">
        Carregando...
      </main>
    )
  }

  return (
    <div className="h-dvh w-full max-w-[430px] mx-auto relative overflow-hidden bg-background">
      {renderScreen()}
      {SCREENS_WITH_NAV.has(tela) && (
        <BottomNav activeScreen={tela} onNavigate={navigate} />
      )}
    </div>
  )
}