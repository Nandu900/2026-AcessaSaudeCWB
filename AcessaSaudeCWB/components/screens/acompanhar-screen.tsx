"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Clock, MapPin, Stethoscope, CheckCircle2, ArrowLeft } from "lucide-react"

interface Appointment {
  id: string
  especialidade: string
  unidade: string
  data: string
  horario: string
  posicaoFila: number
  tempoEstimado: string
  status: string
  exemplo?: boolean
}

interface Triage {
  id: string
  dataCriacao: string
  sintomas: string
  ambulancia: string
  cuidadosEspeciais: string
  unidade: string
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    especialidade: "Clinico Geral",
    unidade: "UBS Boqueirao",
    data: "15/03/2026",
    horario: "14:30",
    posicaoFila: 3,
    tempoEstimado: "15-20 min",
    status: "Exemplo fictício",
    exemplo: true,
  },
  {
    id: "2",
    especialidade: "Odontologia",
    unidade: "UBS Campo Comprido",
    data: "22/03/2026",
    horario: "09:00",
    posicaoFila: 8,
    tempoEstimado: "40-50 min",
    status: "Exemplo fictício",
    exemplo: true,
  },
]

interface AcompanharScreenProps {
  email: string
  onNavigate: (screen: string) => void
}

export function AcompanharScreen({ email, onNavigate }: AcompanharScreenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [triages, setTriages] = useState<Triage[]>([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const [recordsError, setRecordsError] = useState("")

  useEffect(() => {
    if (!email.trim()) {
      setAppointments([])
      setTriages([])
      setLoadingRecords(false)
      return
    }

    let active = true
    setLoadingRecords(true)
    setRecordsError("")

    const loadRecords = async (action: string) => {
      const response = await fetch(`/api/planilhas?action=${action}&email=${encodeURIComponent(email)}`)
      const result = await response.json()
      if (!response.ok || !result.ok) throw new Error(result.error || "Não foi possível consultar os registros.")
      return Array.isArray(result.data) ? result.data : []
    }

    Promise.all([loadRecords("agendamentos"), loadRecords("triagens")])
      .then(([appointmentRows, triageRows]) => {
        if (!active) return
        setAppointments(appointmentRows.map((row: Record<string, string>) => ({
          id: row.id || crypto.randomUUID(),
          especialidade: row.especialidade || "Atendimento",
          unidade: row.unidade || "Unidade a definir",
          data: row.dataconsulta || "Data a definir",
          horario: row.horario || "",
          posicaoFila: 0,
          tempoEstimado: "",
          status: row.status || "Solicitado",
        })))
        setTriages(triageRows.map((row: Record<string, string>) => ({
          id: row.id || crypto.randomUUID(),
          dataCriacao: row.datacriacao || "",
          sintomas: row.sintomas || "",
          ambulancia: row.ambulancia || "Não",
          cuidadosEspeciais: row.cuidadosespeciais || "",
          unidade: row.unidade || "",
        })))
      })
      .catch((error: unknown) => {
        if (active) setRecordsError(error instanceof Error ? error.message : "Não foi possível consultar os registros.")
      })
      .finally(() => {
        if (active) setLoadingRecords(false)
      })

    return () => {
      active = false
    }
  }, [email])

  const allAppointments = [...appointments, ...mockAppointments]
  const selected = allAppointments.find((appointment) => appointment.id === selectedId)

  // Detail view
  if (selected) {
    return (
      <div className="bg-background h-full flex flex-col pb-20">
        <header className="bg-primary text-primary-foreground px-4 py-4 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => {
              setSelectedId(null)
              setConfirmed(false)
            }}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-colors"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold tracking-tight">Detalhes do Atendimento</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-5">
          {selected.exemplo ? (
            <div className="bg-card rounded-2xl p-6 shadow-sm border border-border text-center mb-4">
              <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Fila de demonstração</p>
              <p className="text-5xl font-bold text-primary mb-1">{selected.posicaoFila}&#186;</p>
              <p className="text-sm text-muted-foreground">Tempo estimado fictício: {selected.tempoEstimado}</p>
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-5 shadow-sm border border-border text-center mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Status do agendamento</p>
              <p className="font-bold text-primary">{selected.status}</p>
            </div>
          )}

          {/* Details Card */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-4">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Informacoes
            </p>
            <div className="flex flex-col gap-3">
              <DetailRow label="Especialidade" value={selected.especialidade} icon={Stethoscope} />
              <div className="h-px bg-border" />
              <DetailRow label="Unidade" value={selected.unidade} icon={MapPin} />
              <div className="h-px bg-border" />
              <DetailRow label="Data" value={`${selected.data}${selected.horario ? ` às ${selected.horario}` : ""}`} icon={Clock} />
            </div>
          </div>

          {/* Confirm Presence */}
          {selected.exemplo && confirmed ? (
            <div className="bg-success/10 border border-success/20 rounded-2xl p-5 text-center">
              <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-2" />
              <p className="font-bold text-success text-base">Presenca Confirmada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Aguarde ser chamado(a) no painel.
              </p>
            </div>
          ) : selected.exemplo ? (
            <button
              onClick={() => setConfirmed(true)}
              className="w-full bg-success text-success-foreground font-bold py-4 rounded-xl transition-all hover:bg-success/90 active:scale-[0.98] text-base"
            >
              Confirmar Presenca (demonstração)
            </button>
          ) : null}
        </main>
      </div>
    )
  }

  // List view
  return (
    <div className="bg-background h-full flex flex-col pb-20">
      <PageHeader title="Acompanhar" onBack={() => onNavigate("home")} variant="info" />
      <main className="flex-1 overflow-y-auto p-5">
        <div className="mb-3 flex items-center gap-3">
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-border" />
          <h2 className="text-sm font-bold text-foreground">Seus atendimentos</h2>
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-border" />
        </div>
        {loadingRecords && <p role="status" className="mb-3 text-sm text-muted-foreground">Carregando seus registros...</p>}
        {recordsError && <p role="alert" className="mb-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm text-foreground">{recordsError}</p>}
        {!email && <p className="mb-3 text-sm text-muted-foreground">Informe seu e-mail no Perfil para buscar seus registros.</p>}
        {appointments.length === 0 && email && !loadingRecords && !recordsError && (
          <p className="mb-3 text-sm text-muted-foreground">Ainda não há atendimentos registrados para este e-mail.</p>
        )}
        <div className="mb-5 flex flex-col gap-3">
          {appointments.map((appt) => (
            <button
              key={appt.id}
              onClick={() => setSelectedId(appt.id)}
              className="w-full rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="font-bold text-foreground text-base">{appt.especialidade}</h3>
              <p className="text-sm text-muted-foreground">{appt.unidade}</p>
              <p className="mt-2 text-xs text-muted-foreground">{appt.data}{appt.horario ? ` às ${appt.horario}` : ""}</p>
              <span className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">{appt.status}</span>
            </button>
          ))}
        </div>
        <div className="mb-3 flex items-center gap-3">
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-border" />
          <h2 className="text-sm font-bold text-foreground">Triagens</h2>
          <span aria-hidden="true" className="flex-1 border-t border-dashed border-border" />
        </div>
        {triages.length === 0 && email && !loadingRecords && !recordsError && (
          <p className="mb-3 text-sm text-muted-foreground">Nenhuma triagem registrada para este e-mail.</p>
        )}
        <div className="mb-6 flex flex-col gap-3">
          {triages.map((triage) => (
            <div key={triage.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="font-semibold text-foreground">{triage.sintomas || "Triagem de urgência"}</p>
              <p className="mt-1 text-xs text-muted-foreground">{triage.dataCriacao ? new Date(triage.dataCriacao).toLocaleString("pt-BR") : "Data não informada"}</p>
              <p className="mt-2 text-sm text-muted-foreground">Ambulância: {triage.ambulancia}</p>
              {triage.cuidadosEspeciais && <p className="mt-1 text-sm text-muted-foreground">Cuidados: {triage.cuidadosEspeciais}</p>}
              {triage.unidade && <p className="mt-1 text-sm text-muted-foreground">Unidade: {triage.unidade}</p>}
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Exemplos fictícios
        </p>
        <div className="flex flex-col gap-3">
          {mockAppointments.map((appt) => (
            <button
              key={appt.id}
              onClick={() => setSelectedId(appt.id)}
              className="bg-card rounded-2xl p-5 shadow-sm border border-border text-left transition-all hover:shadow-md active:scale-[0.98] w-full"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-base">{appt.especialidade}</h3>
                    <p className="text-sm text-muted-foreground">{appt.unidade}</p>
                  </div>
                </div>
                <span className="text-xs font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full shrink-0">
                  {appt.posicaoFila}&#186; fila
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{appt.data} - {appt.horario}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

function DetailRow({ label, value, icon: Icon }: DetailRowProps) {
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
