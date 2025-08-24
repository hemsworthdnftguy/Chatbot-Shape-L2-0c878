import axios from 'axios'
import { z } from 'zod'

export const NFTItemSchema = z.object({
	name: z.string().optional(),
	image: z.string().url().optional(),
	tokenId: z.string().optional(),
	href: z.string().url().optional(),
})

export const NFTListSchema = z.object({ items: z.array(NFTItemSchema), todo: z.boolean().optional(), message: z.string().optional(), nextSteps: z.array(z.string()).optional() })

const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || ''

function osHeaders() {
	const headers: Record<string, string> = { 'accept': 'application/json' }
	if (OPENSEA_API_KEY) headers['x-api-key'] = OPENSEA_API_KEY
	return headers
}

export async function searchCollections(query: string, limit: number) {
	// OpenSea v2 collection search is not Shape-specific; returning TODO but keep structure
	return NFTListSchema.parse({ items: [], todo: true, message: 'Collection search not available on Shape L2.', nextSteps: [
		'Confirm Shape-compatible NFT indexer availability',
		'If available, implement collection search adapter',
	] })
}

export async function nftsByOwner(address: string, limit: number) {
	// No known public indexer for Shape L2 owner NFTs; return TODO
	return NFTListSchema.parse({ items: [], todo: true, message: 'Owner NFT lookup not available yet on Shape L2.', nextSteps: [
		'Explore Shape builder-kit for subgraph/indexer references',
		'Integrate marketplace/indexer if they add Shape support',
	] })
}

export async function nftsByCollection(slug: string, limit: number) {
	// No known support; return TODO
	return NFTListSchema.parse({ items: [], todo: true, message: 'Collection NFT lookup not available yet on Shape L2.', nextSteps: [
		'Check Manifold/TransientLabs contracts deployed on Shape',
		'Consider indexing events with a subgraph once available',
	] })
}