import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system')

  useEffect(() => {
    const root = document.documentElement
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    root.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <div className="flex items-center gap-2">
      <button aria-label="Light" className="px-2 py-1 rounded border" onClick={() => setTheme('light')}><Sun size={16} /></button>
      <button aria-label="Dark" className="px-2 py-1 rounded border" onClick={() => setTheme('dark')}><Moon size={16} /></button>
    </div>
  )
}
