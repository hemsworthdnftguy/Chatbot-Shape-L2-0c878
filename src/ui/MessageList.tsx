import { useEffect, useRef } from 'react'
import { useAppStore } from '@/state/store'

export default function MessageList() {
  const messages = useAppStore((s) => s.messages)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div ref={containerRef} className="flex-1 overflow-auto p-4 space-y-3" aria-live="polite" aria-relevant="additions">
      {messages.map((m) => (
        <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
          <div className={m.role === 'user' ? 'bg-primary text-primary-foreground rounded-md px-3 py-2 max-w-[80%]' : 'bg-muted text-foreground rounded-md px-3 py-2 max-w-[80%]'}>
            {m.content}
          </div>
        </div>
      ))}
      {messages.length === 0 && (
        <div className="text-sm text-muted-foreground">Start typing to begin the conversation…</div>
      )}
    </div>
  )
}