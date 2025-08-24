import { useState } from 'react'
import { ThemeToggle } from '../lib/components/ThemeToggle'
import { InspectorPanel } from '../lib/components/InspectorPanel'
import { ChatInput } from '../lib/components/ChatInput'
import { MessageList } from '../lib/components/MessageList'
import { StatusBar } from '../lib/components/StatusBar'
import { Toaster } from 'sonner'
import { FunctionToolbar } from '../lib/components/FunctionToolbar'
import { useChatStore } from '../state/chatStore'
import { Button } from '@/components/ui/button'

export default function App() {
  const [inspectorData, setInspectorData] = useState<any>(null)
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="border-b"><StatusBar /></div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_380px]">
        <div className="flex flex-col">
          <div className="p-4 flex justify-between items-center gap-2 border-b">
            <div className="flex items-center gap-3">
              <img alt="Otom AI" src="/logo.svg" className="w-6 h-6 rounded" />
              <h1 className="text-lg font-semibold">Otom AI</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button>shadcn Button</Button>
              <ThemeToggle />
            </div>
          </div>
          <div className="p-3 border-b">
            <FunctionToolbar onInspector={setInspectorData} onAssistant={(t) => useChatStore.getState().addMessage({ role: 'assistant', content: t })} />
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
