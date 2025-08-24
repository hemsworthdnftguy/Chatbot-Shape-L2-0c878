import { z } from 'zod'
import { parseWith, requestWithRetry } from './http'

const BlockHead = z.object({ height: z.number().nullable() })
const RecentBlocks = z.object({
	blocks: z.array(z.object({
		number: z.number(),
		hash: z.string().optional().default(''),
		timestamp: z.number().optional().default(0),
		txCount: z.number().optional().default(0),
	})),
})
const Balance = z.object({ address: z.string(), balanceWei: z.string(), balanceEther: z.number() })
const TxData = z.object({ tx: z.any().nullable(), receipt: z.any().nullable() })
const SentTx = z.object({ hash: z.string() })
const NFTSearch = z.object({
	items: z.array(z.any()).optional(),
	collection: z.any().optional(),
	links: z.object({ collection: z.string().optional(), owner: z.string().optional() }).optional(),
	source: z.string().optional(),
	todo: z.string().optional(),
})

export const api = {
	getHead: async () => {
		const data = await requestWithRetry({ url: '/api/blocks/head' })
		return parseWith(BlockHead, data)
	},
	listRecentBlocks: async (limit = 10) => {
		const data = await requestWithRetry({ url: `/api/blocks/recent?limit=${limit}` })
		return parseWith(RecentBlocks, data)
	},
	getBalance: async (address: string) => {
		const data = await requestWithRetry({ url: `/api/balance/${address}` })
		return parseWith(Balance, data)
	},
	getTransaction: async (hash: string) => {
		const data = await requestWithRetry({ url: `/api/tx/${hash}` })
		return parseWith(TxData, data)
	},
	sendTransaction: async (rawTx: string) => {
		const data = await requestWithRetry({ url: `/api/tx/send`, method: 'POST', data: { rawTx } })
		return parseWith(SentTx, data)
	},
	searchNFTs: async (ownerOrCollection: string, limit = 10) => {
		const data = await requestWithRetry({ url: `/api/nfts/search`, params: { ownerOrCollection, limit } })
		return parseWith(NFTSearch, data)
	},
}