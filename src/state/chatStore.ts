import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ChatMessage = { role: 'user' | 'assistant'; content: string }

type ChatState = {
  messages: ChatMessage[]
  addMessage: (m: ChatMessage) => void
  clear: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
      clear: () => set({ messages: [] }),
    }),
    { name: 'shape-l2-chat' }
  )
)
