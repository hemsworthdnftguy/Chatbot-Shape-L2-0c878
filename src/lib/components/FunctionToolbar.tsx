import { api } from '@/api/client'
import { useState } from 'react'
import { toast } from 'sonner'

export function FunctionToolbar({ onInspector, onAssistant }: { onInspector: (data: any) => void; onAssistant: (text: string) => void }) {
	const [busy, setBusy] = useState<string | null>(null)

	async function run(name: string, fn: () => Promise<any>) {
		if (busy) return
		setBusy(name)
		try {
			const out = await fn()
			onInspector(out)
			onAssistant(`Executed ${name}.`)
		} catch (e: any) {
			toast.error(e?.message || `Failed: ${name}`)
		} finally {
			setBusy(null)
		}
	}

	return (
		<div className="flex flex-wrap gap-2">
			<button className="px-3 py-1 rounded border text-sm" disabled={!!busy} onClick={() => run('listRecentBlocks', () => api.listRecentBlocks(10))}>Blocks</button>
			<button className="px-3 py-1 rounded border text-sm" disabled={!!busy} onClick={() => run('getBalance', () => api.getBalance('0x413Bb94c8515f2bd338417F09119Da461E015194'))}>Balance</button>
			<button className="px-3 py-1 rounded border text-sm" disabled={!!busy} onClick={() => run('getTransaction', () => api.getTransaction('0xfe591f9a4f70b9bc7cb17d2af8a6e5d6c192362ee356a5df332579e4fe5d505f'))}>Tx</button>
			<button className="px-3 py-1 rounded border text-sm" disabled={!!busy} onClick={() => run('searchNFTs', () => api.searchNFTs('deeple-stuff', 10))}>NFTs</button>
		</div>
	)
}