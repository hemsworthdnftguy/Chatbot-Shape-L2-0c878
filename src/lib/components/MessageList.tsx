import { useChatStore } from '../../state/chatStore'

const TX_HASH = /0x[a-fA-F0-9]{64}/g
const ADDRESS = /0x[a-fA-F0-9]{40}/g
const explorer = 'https://shapescan.xyz'

function linkify(text: string) {
	return text
		.replace(TX_HASH, (m) => `[${m}](${explorer}/tx/${m})`)
		.replace(ADDRESS, (m) => `[${m}](${explorer}/address/${m})`)
}

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
            <div className="whitespace-pre-wrap break-words prose dark:prose-invert prose-sm" dangerouslySetInnerHTML={{ __html: linkify(m.content) }} />
          </div>
        ))
      )}
    </div>
  )
}
