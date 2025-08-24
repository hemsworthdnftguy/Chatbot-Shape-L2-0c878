import { z } from 'zod'
import { searchCollections, nftsByOwner, nftsByCollection } from '@/lib/shapeClient'
import type { Tool } from '@/lib/tools/types'

const Input = z.object({
	query: z.string().trim().min(1),
	mode: z.enum(['collections', 'by-owner', 'by-collection']).default('collections'),
	limit: z.coerce.number().min(1).max(50).default(10),
})

const tool: Tool<z.infer<typeof Input>> = {
	id: 'searchNFTs',
	label: 'Search NFTs',
	description: 'Search NFTs by collections, owner, or collection slug',
	inputSchema: Input,
	fields: [
		{ name: 'query', label: 'Query or Address/Slug', placeholder: '0x... or slug', type: 'text' },
		{ name: 'mode', label: 'Mode', placeholder: 'collections/by-owner/by-collection', type: 'text' },
		{ name: 'limit', label: 'Limit', placeholder: '10', type: 'number' },
	],
	run: async ({ query, mode, limit }) => {
		if (mode === 'by-owner') {
			const res = await nftsByOwner(query, limit)
			return { message: `Found ${res.items.length} NFTs`, cards: res.items.map((_, i) => ({ id: `owner_${i}`, title: `NFT ${i+1}` })) }
		}
		if (mode === 'by-collection') {
			const res = await nftsByCollection(query, limit)
			return { message: `Found ${res.items.length} NFTs`, cards: res.items.map((_, i) => ({ id: `col_${i}`, title: `NFT ${i+1}` })) }
		}
		const res = await searchCollections(query, limit)
		return { message: `Result: ${res.items.length} collections`, cards: res.items.map((_, i) => ({ id: `col_${i}`, title: `Collection ${i+1}` })) }
	},
}

export default tool