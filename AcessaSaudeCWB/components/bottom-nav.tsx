"use client"

import { Home, Activity, User, Settings, type LucideIcon } from "lucide-react"

interface NavItem {
  icon: LucideIcon
  label: string
  screen: string
}

const navItems: NavItem[] = [
  { icon: Home, label: "Inicio", screen: "home" },
  { icon: Activity, label: "Saude", screen: "saude" },
  { icon: User, label: "Perfil", screen: "perfil" },
  { icon: Settings, label: "Mais", screen: "mais" },
]

interface BottomNavProps {
  activeScreen: string
  onNavigate: (screen: string) => void
}

export function BottomNav({ activeScreen, onNavigate }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border"
      style={{ maxWidth: "430px", margin: "0 auto" }}
      role="navigation"
      aria-label="Menu principal"
    >
      <div className="flex justify-around items-center px-2 py-2">
        {navItems.map(({ icon: Icon, label, screen }) => {
          const isActive = activeScreen === screen
          return (
            <button
              key={screen}
              onClick={() => onNavigate(screen)}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all min-w-[64px] min-h-[56px] ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[11px] leading-none ${isActive ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
