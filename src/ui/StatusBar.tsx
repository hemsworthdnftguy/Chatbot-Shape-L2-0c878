import { useEffect } from 'react'
import { useAppStore } from '@/state/store'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StatusBar() {
  const theme = useAppStore((s) => s.theme)
  const network = useAppStore((s) => s.network)
  const serverHealth = useAppStore((s) => s.serverHealth)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="w-6 h-6 rounded" />
        <div className="text-sm">
          <div className="font-medium">Shape L2</div>
          <div className="text-xs text-muted-foreground">{network}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div aria-label="Server health" className="text-xs text-muted-foreground">
          {serverHealth === 'ok' ? 'Healthy' : serverHealth === 'unknown' ? 'Unknown' : serverHealth}
        </div>
        <Button aria-label="Toggle theme" variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </div>
    </div>
  )
}