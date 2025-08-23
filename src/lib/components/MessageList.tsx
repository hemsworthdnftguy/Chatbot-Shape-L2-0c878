import { useChatStore } from '../../state/chatStore'

export function MessageList() {
  const messages = useChatStore(s => s.messages)
  return (
    <div className="flex-1 overflow-auto p-4 space-y-3" aria-live="polite">
      {messages.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          Ask about Shape L2, recent blocks, transactions, or NFTs.
        </div>
      ) : (
        messages.map((m, i) => (
          <div key={i} className="rounded border p-3">
            <div className="text-xs text-muted-foreground mb-1">{m.role}</div>
            <div className="whitespace-pre-wrap break-words">{m.content}</div>
          </div>
        ))
      )}
    </div>
  )
}
