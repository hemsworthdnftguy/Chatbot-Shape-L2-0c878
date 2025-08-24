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

export const BalanceSchema = z.object({ address: z.string(), balanceWei: z.string(), balanceEther: z.number() })
export async function getBalance(address: string) {
	const res = await http.get('/shape/balance', { params: { address } })
	return BalanceSchema.parse(res.data)
}

export const TxSchema = z.object({ tx: z.any().nullable(), receipt: z.any().nullable() })
export async function getTx(hash: string) {
	const res = await http.get('/shape/tx', { params: { hash } })
	return TxSchema.parse(res.data)
}

export const BlocksSchema = z.object({ blocks: z.array(z.object({ number: z.number(), hash: z.string(), timestamp: z.number(), txCount: z.number() })) })
export async function listBlocks(limit = 10) {
	const res = await http.get('/shape/blocks', { params: { limit } })
	return BlocksSchema.parse(res.data)
}

export const NftsCollectionsSchema = z.object({ items: z.array(z.any()), todo: z.string().optional() })
export async function searchCollections(query: string, limit = 10) {
	const res = await http.get('/shape/nfts/collections', { params: { query, limit } })
	return NftsCollectionsSchema.parse(res.data)
}

export const NftsByOwnerSchema = z.object({ address: z.string(), items: z.array(z.any()), todo: z.string().optional() })
export async function nftsByOwner(address: string, limit = 10) {
	const res = await http.get('/shape/nfts/by-owner', { params: { address, limit } })
	return NftsByOwnerSchema.parse(res.data)
}

export const NftsByCollectionSchema = z.object({ slug: z.string(), items: z.array(z.any()), todo: z.string().optional() })
export async function nftsByCollection(slug: string, limit = 10) {
	const res = await http.get('/shape/nfts/by-collection', { params: { slug, limit } })
	return NftsByCollectionSchema.parse(res.data)
}