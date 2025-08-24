import MessageList from '@/ui/MessageList'
import MessageInput from '@/ui/MessageInput'

export default function ChatWindow() {
  return (
    <div className="flex-1 flex flex-col">
      <MessageList />
      <MessageInput />
    </div>
  )
}