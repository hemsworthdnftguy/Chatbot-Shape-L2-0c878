import { useEffect, useState } from 'react'
import axios from 'axios'

export function StatusBar() {
  const [network] = useState('Shape L2')
  const [block, setBlock] = useState<number | null>(null)
  const [healthy, setHealthy] = useState<boolean | null>(null)

  useEffect(() => {
    let mounted = true
    const fetcher = async () => {
      try {
        const [h, b] = await Promise.all([
          axios.get('/api/health'),
          axios.get('/api/blocks/head'),
        ])
        if (!mounted) return
        setHealthy(true)
        setBlock(b.data?.height ?? null)
      } catch {
        if (!mounted) return
        setHealthy(false)
      }
    }
    fetcher()
    const id = setInterval(fetcher, 10000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  return (
    <div className="px-4 py-2 text-sm flex items-center gap-4">
      <div><span className="font-medium">Network:</span> {network}</div>
      <div><span className="font-medium">Head:</span> {block ?? '—'}</div>
      <div>
        <span className="font-medium">Server:</span> {healthy == null ? '…' : healthy ? 'healthy' : 'down'}
      </div>
    </div>
  )
}
