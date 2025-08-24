import { useRef, useState } from 'react'
import { useAppStore } from '@/state/store'
import { Button } from '@/components/ui/button'

export default function MessageInput() {
  const addMessage = useAppStore((s) => s.addMessage)
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const send = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    addMessage('user', trimmed)
    setValue('')
    textareaRef.current?.focus()
  }

  return (
    <div className="border-t p-3">
      <label htmlFor="chat-input" className="sr-only">Message input</label>
      <textarea
        id="chat-input"
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            send()
          }
        }}
        aria-label="Type your message"
        placeholder="Type a message"
        className="w-full h-24 resize-none rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <div className="flex justify-end pt-2">
        <Button onClick={send} aria-label="Send message">Send</Button>
      </div>
    </div>
  )
}