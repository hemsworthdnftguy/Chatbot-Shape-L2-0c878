import { z } from 'zod'
import { getTx } from '@/lib/shapeClient'
import type { Tool } from '@/lib/tools/types'

const Input = z.object({ hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/) })

const tool: Tool<z.infer<typeof Input>> = {
	id: 'getTransaction',
	label: 'Transaction',
	description: 'Get transaction details by hash',
	inputSchema: Input,
	fields: [
		{ name: 'hash', label: 'Tx Hash', placeholder: '0x...', type: 'text' },
	],
	run: async ({ hash }) => {
		const res = await getTx(hash)
		return {
			message: 'Fetched transaction',
			cards: [
				{ id: `tx_${hash}`, title: 'Transaction', description: res.tx ? `From ${res.tx.from} to ${res.tx.to}` : 'Not found', href: (res.tx ? (await import('@/lib/explorer')).getExplorerUrl('tx', hash) : undefined) },
			],
		}
	},
}

export default tool