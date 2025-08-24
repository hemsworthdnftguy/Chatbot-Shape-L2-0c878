import type { ResultCardData } from '@/types'

export default function ResultCard({ title, description, href }: ResultCardData) {
  return (
    <div className="rounded-md border p-3">
      <div className="font-medium text-sm">{title}</div>
      {description && <div className="text-xs text-muted-foreground">{description}</div>}
      {href && (
        <a className="text-xs text-primary underline" href={href} target="_blank" rel="noreferrer">Open</a>
      )}
    </div>
  )
}