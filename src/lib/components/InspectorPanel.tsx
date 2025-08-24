type InspectorProps = { data: any }
export function InspectorPanel({ data }: InspectorProps) {
  if (!data) return <div className="p-4 text-sm text-muted-foreground">No function outputs yet.</div>
  try {
    if (Array.isArray(data)) {
      return (
        <div className="p-4">
          <div className="font-semibold mb-2">Results</div>
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead><tr>{Object.keys(data[0] || {}).map(k => (<th key={k} className="text-left p-1 border-b">{k}</th>))}</tr></thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>{Object.values(row).map((v, j) => (<td key={j} className="p-1 border-b align-top">{String(v)}</td>))}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    }
    if (typeof data === 'object') {
      return (
        <div className="p-4 space-y-1 text-sm">
          <div className="font-semibold">Result</div>
          {Object.entries(data).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[140px_1fr] gap-2">
              <div className="text-muted-foreground">{k}</div>
              <div className="break-words">{typeof v === 'string' ? v : JSON.stringify(v, null, 2)}</div>
            </div>
          ))}
        </div>
      )
    }
  } catch (e) {
    return <div className="p-4 text-sm text-red-500">Failed to render inspector.</div>
  }
  return <div className="p-4">Unsupported inspector data.</div>
}
