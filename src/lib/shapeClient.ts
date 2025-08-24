import { z } from 'zod'
import { http } from '@/lib/http'

export const HealthSchema = z.object({ ok: z.boolean(), ts: z.number() })
export async function getHealth() {
	const res = await http.get('/health')
	return HealthSchema.parse(res.data)
}

export const BlockHeightSchema = z.object({ height: z.number().nullable() })
export async function getBlockHeight() {
	const res = await http.get('/shape/blockHeight')
	return BlockHeightSchema.parse(res.data)
}

export const BalanceSchema = z.object({ address: z.string(), balanceWei: z.string().optional(), balanceEther: z.number().optional(), todo: z.boolean().optional(), message: z.string().optional() })
export async function getBalance(address: string) {
	const res = await http.get('/shape/balance', { params: { address } })
	return BalanceSchema.parse(res.data)
}

export const TxSchema = z.object({ tx: z.any().nullable().optional(), receipt: z.any().nullable().optional(), todo: z.boolean().optional(), message: z.string().optional() })
export async function getTx(hash: string) {
	const res = await http.get('/shape/tx', { params: { hash } })
	return TxSchema.parse(res.data)
}

export const BlocksSchema = z.object({ blocks: z.array(z.object({ number: z.number(), hash: z.string(), timestamp: z.number(), txCount: z.number() })) })
export async function listBlocks(limit = 10) {
	const res = await http.get('/shape/blocks', { params: { limit } })
	return BlocksSchema.parse(res.data)
}

export const NFTItemSchema = z.object({ name: z.string().optional(), image: z.string().url().optional(), tokenId: z.string().optional(), href: z.string().url().optional() })
export const NFTListSchema = z.object({ items: z.array(NFTItemSchema), todo: z.boolean().optional(), message: z.string().optional(), nextSteps: z.array(z.string()).optional() })

export async function searchCollections(query: string, limit = 10) {
	const res = await http.get('/shape/nfts/collections', { params: { query, limit } })
	return NFTListSchema.parse(res.data)
}

export async function nftsByOwner(address: string, limit = 10) {
	const res = await http.get('/shape/nfts/by-owner', { params: { address, limit } })
	return NFTListSchema.parse(res.data)
}

export async function nftsByCollection(slug: string, limit = 10) {
	const res = await http.get('/shape/nfts/by-collection', { params: { slug, limit } })
	return NFTListSchema.parse(res.data)
}