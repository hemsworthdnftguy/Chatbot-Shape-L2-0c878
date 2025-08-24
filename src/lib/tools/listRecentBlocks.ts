import { z } from 'zod'
import { listBlocks } from '@/lib/shapeClient'
import type { Tool } from '@/lib/tools/types'

const Input = z.object({ limit: z.coerce.number().min(1).max(20).default(10) })

const tool: Tool<z.infer<typeof Input>> = {
	id: 'listRecentBlocks',
	label: 'Recent Blocks',
	description: 'List recent blocks summary',
	inputSchema: Input,
	fields: [
		{ name: 'limit', label: 'Limit', placeholder: '10', type: 'number' },
	],
	run: async ({ limit }) => {
		const res = await listBlocks(limit)
		return {
			message: `Fetched ${res.blocks.length} blocks`,
			cards: res.blocks.map((b) => ({ id: `blk_${b.number}`, title: `Block #${b.number}`, description: `${b.txCount} txs` })),
		}
	},
}

export default tool