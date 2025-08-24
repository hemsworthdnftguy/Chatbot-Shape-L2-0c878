import { useAppStore } from '@/state/store'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Inspector() {
  const results = useAppStore((s) => s.results)

  if (results.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">No results yet</div>
    )
  }

  return (
    <div className="p-3 space-y-2">
      {results.map((r) => (
        <CollapsibleCard key={r.id} title={r.title} description={r.description} href={r.href} />
      ))}
    </div>
  )
}

function CollapsibleCard({ title, description, href }: { title: string; description?: string; href?: string }) {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-md border">
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="font-medium text-sm">{title}</div>
        <div className="flex items-center gap-2">
          {href && <a className="text-xs text-primary underline" href={href} target="_blank" rel="noreferrer">Open</a>}
          <Button size="sm" variant="ghost" onClick={() => setOpen(!open)} aria-label="Toggle details">{open ? 'Hide' : 'Show'}</Button>
        </div>
      </div>
      {open && (
        <div className="p-3 space-y-2">
          {description && <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">{description}</pre>}
          <Button size="sm" variant="outline" aria-label="Copy JSON" onClick={() => navigator.clipboard.writeText(JSON.stringify({ title, description, href }, null, 2))}>Copy JSON</Button>
        </div>
      )}
    </div>
  )
}