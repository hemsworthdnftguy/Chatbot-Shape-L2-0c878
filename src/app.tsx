import StatusBar from '@/ui/StatusBar'
import Sidebar from '@/ui/Sidebar'
import ChatWindow from '@/ui/ChatWindow'
import Inspector from '@/ui/Inspector'
import { Toaster } from 'sonner'

export default function AppLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Toaster richColors position="top-right" />
      <div className="border-b"><StatusBar /></div>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[220px_1fr_380px]">
        <aside className="border-r hidden md:block">
          <Sidebar />
        </aside>
        <main className="flex flex-col">
          {children ?? <ChatWindow />}
        </main>
        <aside className="border-l hidden md:block">
          <Inspector />
        </aside>
      </div>
    </div>
  )
}