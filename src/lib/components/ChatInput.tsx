import { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../state/chatStore'
import axios from 'axios'
import { toast } from 'sonner'

export function ChatInput({ onInspector }: { onInspector: (data: any) => void }) {
  const addMessage = useChatStore(s => s.addMessage)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const send = async () => {
    const content = value.trim()
    if (!content) return
    setLoading(true)
    addMessage({ role: 'user', content })
    try {
      const res = await axios.post('/api/chat', { message: content })
      if (res.data?.assistant) {
        addMessage({ role: 'assistant', content: res.data.assistant })
      }
      if (res.data?.toolOutput) {
        onInspector(res.data.toolOutput)
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Request failed')
    } finally {
      setLoading(false)
      setValue('')
      textareaRef.current?.focus()
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        aria-label="Message"
        className="flex-1 min-h-[60px] max-h-40 p-2 rounded border bg-background"
        placeholder="Ask about blocks, transactions, balances, or NFTs..."
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <button disabled={loading} onClick={send} className="h-10 px-4 rounded bg-primary text-primary-foreground border">
        {loading ? 'Sending…' : 'Send'}
      </button>
    </div>
  )
}
