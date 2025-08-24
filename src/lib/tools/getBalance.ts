import { z } from 'zod'
import { getBalance as apiGetBalance } from '@/lib/shapeClient'
import type { Tool } from '@/lib/tools/types'

const Input = z.object({ address: z.string().regex(/^0x[a-fA-F0-9]{40}$/) })

const tool: Tool<z.infer<typeof Input>> = {
	id: 'getBalance',
	label: 'Balance',
	description: 'Get account balance by address',
	inputSchema: Input,
	fields: [
		{ name: 'address', label: 'Address', placeholder: '0x...', type: 'text' },
	],
	run: async ({ address }) => {
		const res = await apiGetBalance(address)
		return {
			message: `Balance for ${res.address}: ${res.balanceEther} ETH`,
			cards: [
				{ id: `balance_${res.address}`, title: 'Balance', description: `${res.balanceEther} ETH (${res.balanceWei} wei)` },
			],
		}
	},
}

export default tool