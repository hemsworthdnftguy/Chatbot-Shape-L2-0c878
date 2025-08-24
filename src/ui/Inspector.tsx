import { useAppStore } from '@/state/store'

export default function Inspector() {
  const results = useAppStore((s) => s.results)

  if (results.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">No results yet</div>
    )
  }

  // Very simple rendering: if description hints TODO, show it; else show as cards
  return (
    <div className="p-3 space-y-2">
      {results.map((r) => (
        <div key={r.id} className="rounded-md border p-3">
          <div className="font-medium text-sm mb-1">{r.title}</div>
          {r.description && <div className="text-xs text-muted-foreground mb-2 whitespace-pre-wrap">{r.description}</div>}
          {r.href && (
            <a className="text-xs text-primary underline" href={r.href} target="_blank" rel="noreferrer">Open</a>
          )}
        </div>
      ))}
    </div>
  )
}