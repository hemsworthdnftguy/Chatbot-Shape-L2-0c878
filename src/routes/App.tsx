import { useState } from 'react'
import { ThemeToggle } from '../lib/components/ThemeToggle'
import { InspectorPanel } from '../lib/components/InspectorPanel'
import { ChatInput } from '../lib/components/ChatInput'
import { MessageList } from '../lib/components/MessageList'
import { StatusBar } from '../lib/components/StatusBar'
import { Toaster } from 'sonner'

export default function App() {
  const [inspectorData, setInspectorData] = useState<any>(null)
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="border-b"><StatusBar /></div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_380px]">
        <div className="flex flex-col">
          <div className="p-4 flex justify-between items-center gap-2 border-b">
            <h1 className="text-lg font-semibold">Shape L2 Chat</h1>
            <ThemeToggle />
          </div>
          <MessageList />
          <div className="border-t p-3">
            <ChatInput onInspector={setInspectorData} />
          </div>
        </div>
        <div className="border-l hidden md:block">
          <InspectorPanel data={inspectorData} />
        </div>
      </div>
    </div>
  )
}
