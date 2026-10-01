"use client"

import { useState } from "react"
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

// URL do seu Google Apps Script configurado anteriormente
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbz8WZqtX1KFOZnxOVzj4jNXg1X1zp2hiK7xKtqOXS9dTsf5Pm1TiGQwEndJ6HyFIvVZGw/exec';

export default function App() {
  const [tela, setTela] = useState("home")
  const [dados, setDados] = useState<DadosPaciente>(initialDados)

  const salvarDadosNoGoogle = async (dadosParaSalvar: DadosPaciente) => {
    const payload = {
      timestamp: new Date().toLocaleString('pt-BR'),
      ...dadosParaSalvar,
      sintomas: dadosParaSalvar.sintomas.join(', ')
    };

    try {
      await fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log("Dados enviados com sucesso!");
    } catch (e) {
      console.error("Erro ao enviar para o Sheets:", e);
    }
  };

  const updateDados = (partial: Partial<DadosPaciente>) => {
    setDados((prev) => ({ ...prev, ...partial }))
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
        return <HorariosScreen onNavigate={navigate} />
      case "urgencia":
        return (
          <UrgenciaScreen
            onSelect={(urg) => {
              updateDados({ urgencia: urg })
              navigate("unidades")
            }}
            onNavigate={navigate}
          />
        )
      case "unidades":
        return (
          <UnidadesScreen
            onSelect={(unidade) => {
              const finalData = { ...dados, unidade };
              updateDados({ unidade })
              salvarDadosNoGoogle(finalData);
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
            onNavigate={(screen) => {
              if (screen === "home") setDados(initialDados)
              navigate(screen)
            }}
          />
        )
      case "acompanhar":
        return <AcompanharScreen onNavigate={navigate} />
      case "saude":
        return <SaudeScreen onNavigate={navigate} />
      case "mais":
        return <MaisScreen onNavigate={navigate} />
      case "perfil":
        return <PerfilScreen onNavigate={navigate} />
      default:
        return <HomeScreen onNavigate={navigate} />
    }
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