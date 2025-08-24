import { useState } from 'react'
import { useAppStore } from '@/state/store'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  const clearChat = useAppStore((s) => s.clearChat)
  const exportChat = useAppStore((s) => s.exportChat)
  const [confirming, setConfirming] = useState(false)

  const handleExport = () => {
    const text = exportChat()
    const blob = new Blob([text], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chat-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClear = () => setConfirming(true)

  return (
    <div className="p-3 space-y-2">
      <Button className="w-full" variant="outline" onClick={handleClear} aria-label="Clear chat">Clear Chat</Button>
      <Button className="w-full" variant="outline" onClick={handleExport} aria-label="Export chat">Export Chat</Button>
      {confirming && (
        <div role="dialog" aria-modal="true" aria-labelledby="clear-title" className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-background rounded-md border p-4 w-full max-w-sm">
            <div id="clear-title" className="font-medium mb-2">Clear chat?</div>
            <div className="text-sm text-muted-foreground mb-3">This action cannot be undone.</div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirming(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => { clearChat(); setConfirming(false) }}>Clear</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}