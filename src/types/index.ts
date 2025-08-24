export type Role = 'user' | 'assistant' | 'system'

export interface Message {
  id: string
  role: Role
  content: string
  createdAt: number
}

export interface ResultCardData {
  id: string
  title: string
  description?: string
  href?: string
  imageUrl?: string
  tokenId?: string
}