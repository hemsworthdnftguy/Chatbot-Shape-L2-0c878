import { useEffect } from 'react'
import { useAppStore } from '@/state/store'
import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import * as shape from '@/lib/shapeClient'

export default function StatusBar() {
  const theme = useAppStore((s) => s.theme)
  const network = useAppStore((s) => s.network)
  const serverHealth = useAppStore((s) => s.serverHealth)
  const setServerHealth = useAppStore((s) => s.setServerHealth)
  const blockHeight = useAppStore((s) => s.blockHeight)
  const setBlockHeight = useAppStore((s) => s.setBlockHeight)
  const toggleTheme = useAppStore((s) => s.toggleTheme)

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark'
    root.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await shape.getHealth()
        if (!cancelled) setServerHealth(res.ok ? 'ok' : 'degraded')
      } catch {
        if (!cancelled) setServerHealth('down')
      }
      try {
        const h = await shape.getBlockHeight()
        if (!cancelled) setBlockHeight(h.height ?? null)
      } catch {
        if (!cancelled) setBlockHeight(null)
      }
    })()
    return () => { cancelled = true }
  }, [setServerHealth, setBlockHeight])

  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <img src="/logo.svg" alt="Logo" className="w-6 h-6 rounded" />
        <div className="text-sm">
          <div className="font-medium">Shape L2</div>
          <div className="text-xs text-muted-foreground">{network} · Height: {blockHeight ?? '—'}</div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div aria-label="Server health" className={serverHealth === 'ok' ? 'text-xs text-green-600' : 'text-xs text-muted-foreground'}>
          {serverHealth === 'ok' ? 'Healthy' : 'Unknown'}
        </div>
        <Button aria-label="Toggle theme" variant="outline" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </Button>
      </div>
    </div>
  )
}