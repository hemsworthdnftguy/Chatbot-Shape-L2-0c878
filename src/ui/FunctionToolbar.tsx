import { useEffect, useRef, useState } from 'react'
import { toolMeta, getToolById } from '@/lib/tools'
import { Button } from '@/components/ui/button'
import { z } from 'zod'

export default function FunctionToolbar() {
  const [pending, setPending] = useState<{ id: string; values: Record<string, any> } | null>(null)
  const [values, setValues] = useState<Record<string, any>>({})
  const [error, setError] = useState<string | null>(null)
  const firstFieldRef = useRef<HTMLInputElement | null>(null)

  const open = async (id: string) => {
    const t = getToolById(id)
    if (!t) return
    if (!t.fields || t.fields.length === 0) {
      await t.run({})
      return
    }
    const initial: Record<string, any> = {}
    t.fields?.forEach((f) => { initial[f.name] = '' })
    setValues(initial)
    setError(null)
    setPending({ id, values: initial })
  }

  useEffect(() => {
    if (pending) firstFieldRef.current?.focus()
  }, [pending])

  const confirm = async () => {
    if (!pending) return
    const t = getToolById(pending.id)
    if (!t) return
    const parsed = t.inputSchema.safeParse(values)
    if (!parsed.success) { setError('Please provide valid inputs'); return }
    setError(null)
    await t.run(parsed.data)
    setPending(null)
  }

  return (
    <div className="flex gap-2">
      {toolMeta.map((t) => (
        <Button key={t.id} variant="outline" onClick={() => open(t.id)} aria-label={t.label}>{t.label}</Button>
      ))}
      {pending && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-background rounded-md border p-4 w-full max-w-sm" onKeyDown={(e) => {
            if (e.key === 'Tab') {
              // very simple focus trap
              e.preventDefault()
              firstFieldRef.current?.focus()
            }
          }}>
            <div id="confirm-title" className="font-medium mb-2">Confirm: {getToolById(pending.id)?.label}</div>
            <div className="space-y-2">
              {getToolById(pending.id)?.fields?.map((f, i) => (
                <div key={f.name} className="space-y-1">
                  <label className="text-sm" htmlFor={`field-${f.name}`}>{f.label}</label>
                  <input
                    ref={i === 0 ? firstFieldRef : undefined}
                    id={`field-${f.name}`}
                    type={f.type === 'number' ? 'number' : 'text'}
                    placeholder={f.placeholder}
                    aria-label={f.label}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    value={values[f.name] ?? ''}
                    onChange={(e) => setValues((s) => ({ ...s, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  />
                </div>
              ))}
              {error && <div className="text-sm text-red-600">{error}</div>}
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <Button variant="ghost" onClick={() => setPending(null)}>Cancel</Button>
              <Button onClick={confirm}>Run</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}