import { useAppStore } from '@/state/store'
import { Button } from '@/components/ui/button'

export default function Sidebar() {
  const clearChat = useAppStore((s) => s.clearChat)
  const exportChat = useAppStore((s) => s.exportChat)

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

  return (
    <div className="p-3 space-y-2">
      <Button className="w-full" variant="outline" onClick={clearChat} aria-label="Clear chat">Clear Chat</Button>
      <Button className="w-full" variant="outline" onClick={handleExport} aria-label="Export chat">Export Chat</Button>
    </div>
  )
}