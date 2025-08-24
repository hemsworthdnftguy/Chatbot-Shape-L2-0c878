import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Message, ResultCardData, Role } from '@/types'

interface AppState {
  messages: Message[]
  results: ResultCardData[]
  theme: 'light' | 'dark'
  network: string
  blockHeight: number | null
  serverHealth: 'unknown' | 'ok' | 'degraded' | 'down'

  addMessage: (role: Role, content: string) => void
  clearChat: () => void
  exportChat: () => string

  addResult: (result: ResultCardData) => void
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  setNetwork: (v: string) => void
  setBlockHeight: (v: number | null) => void
  setServerHealth: (v: AppState['serverHealth']) => void
}

function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      messages: [],
      results: [],
      theme: (typeof localStorage !== 'undefined' && (localStorage.getItem('theme') as 'light' | 'dark')) || 'light',
      network: import.meta.env.VITE_NETWORK_NAME || 'Shape L2',
      blockHeight: null,
      serverHealth: 'unknown',

      addMessage: (role, content) =>
        set((state) => {
          const next: Message = { id: generateId('msg'), role, content, createdAt: Date.now() }
          const messages = [...state.messages, next].slice(-20)
          return { messages }
        }),

      clearChat: () => set({ messages: [] }),

      exportChat: () => {
        const { messages } = get()
        return JSON.stringify({ exportedAt: new Date().toISOString(), messages }, null, 2)
      },

      addResult: (result) =>
        set((state) => ({ results: [...state.results, result].slice(-20) })),

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      setNetwork: (v) => set({ network: v }),
      setBlockHeight: (v) => set({ blockHeight: v }),
      setServerHealth: (v) => set({ serverHealth: v }),
    }),
    {
      name: 'app-store',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ messages: state.messages.slice(-20), results: state.results.slice(-20), theme: state.theme, network: state.network }),
    }
  )
)