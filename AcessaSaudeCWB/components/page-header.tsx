"use client"

import { ArrowLeft } from "lucide-react"

type HeaderVariant = "primary" | "success" | "destructive" | "info"

const variantClasses: Record<HeaderVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  success: "bg-success text-success-foreground",
  destructive: "bg-destructive text-destructive-foreground",
  info: "bg-primary text-primary-foreground",
}

interface PageHeaderProps {
  title: string
  onBack: () => void
  variant?: HeaderVariant
}

export function PageHeader({ title, onBack, variant = "primary" }: PageHeaderProps) {
  return (
    <header className={`${variantClasses[variant]} px-4 py-4 flex items-center gap-3 shadow-sm`}>
      <button
        onClick={onBack}
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/10 hover:bg-foreground/20 transition-colors"
        aria-label="Voltar"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <h1 className="text-lg font-bold tracking-tight">{title}</h1>
    </header>
  )
}
