import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import axios from 'axios'
import { z } from 'zod'
import { formatUnits } from './utils'

const app = new Hono()

// CORS: safe defaults
app.use('*', logger())
app.use('*', cors({
	origin: '*',
	allowMethods: ['GET', 'POST', 'OPTIONS'],
	allowHeaders: ['Content-Type', 'Authorization'],
}))

// Simple in-memory rate limiter
const requestsByKey = new Map<string, number[]>()
const RATE_LIMIT = 60
const WINDOW_MS = 60_000
app.use('*', async (c, next) => {
	const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'local'
	const now = Date.now()
	const arr = requestsByKey.get(ip) || []
	const recent = arr.filter((t) => now - t < WINDOW_MS)
	if (recent.length >= RATE_LIMIT) {
		return c.json({ message: 'Too many requests' }, 429)
	}
	recent.push(now)
	requestsByKey.set(ip, recent)
	await next()
})

// Health
app.get('/api/health', (c) => c.json({ ok: true, ts: Date.now() }))

// Shape RPC helpers
const SHAPE_RPC_URL = process.env.SHAPE_RPC_URL || 'https://mainnet.shape.network'
const BLOCK_POLL_INTERVAL = Number(process.env.BLOCK_POLL_INTERVAL || 10000)
const hexToNumber = (hex: string): number => parseInt(hex, 16)

async function rpcCall<T>(method: string, params: unknown[] = [], signal?: AbortSignal): Promise<T> {
	const body = { jsonrpc: '2.0', id: Date.now(), method, params }
	let attempt = 0
	let delay = 300
	while (true) {
		try {
			const res = await axios.post(
				SHAPE_RPC_URL,
				body,
				{ timeout: 10_000, signal, headers: { 'content-type': 'application/json' } }
			)
			if (res.data?.error) throw new Error(res.data.error?.message || 'RPC error')
			return res.data.result as T
		} catch (err) {
			if (attempt >= 2) throw err
			await new Promise((r) => setTimeout(r, delay))
			attempt++
			delay *= 2
		}
	}
}

// GET /api/shape/blockHeight -> { height: number | null }
app.get('/api/shape/blockHeight', async (c) => {
	try {
		const bn = await rpcCall<string>('eth_blockNumber')
		return c.json({ height: hexToNumber(bn) })
	} catch (e) {
		return c.json({ height: null, todo: true, message: 'See README Open Questions' })
	}
})

// GET /api/shape/balance?address=
const AddressQuery = z.object({ address: z.string().regex(/^0x[a-fA-F0-9]{40}$/) })
app.get('/api/shape/balance', async (c) => {
	const parsed = AddressQuery.safeParse({ address: c.req.query('address') || '' })
	if (!parsed.success) return c.json({ message: 'Invalid address' }, 400)
	try {
		const balHex = await rpcCall<string>('eth_getBalance', [parsed.data.address, 'latest'])
		const wei = BigInt(balHex)
		const etherStr = formatUnits(wei, 18)
		return c.json({ address: parsed.data.address, balanceWei: wei.toString(), balanceEther: Number(etherStr) })
	} catch (e) {
		return c.json({ address: parsed.data.address, todo: true, message: 'See README Open Questions' })
	}
})

// GET /api/shape/tx?hash=
const TxQuery = z.object({ hash: z.string().regex(/^0x[a-fA-F0-9]{64}$/) })
app.get('/api/shape/tx', async (c) => {
	const parsed = TxQuery.safeParse({ hash: c.req.query('hash') || '' })
	if (!parsed.success) return c.json({ message: 'Invalid tx hash' }, 400)
	try {
		const [tx, receipt] = await Promise.all([
			rpcCall<any>('eth_getTransactionByHash', [parsed.data.hash]),
			rpcCall<any>('eth_getTransactionReceipt', [parsed.data.hash]).catch(() => null),
		])
		return c.json({ tx, receipt })
	} catch (e) {
		return c.json({ todo: true, message: 'See README Open Questions' })
	}
})

// GET /api/shape/blocks?limit=
const BlocksQuery = z.object({ limit: z.coerce.number().min(1).max(20).default(10) })
app.get('/api/shape/blocks', async (c) => {
	const parsed = BlocksQuery.safeParse({ limit: c.req.query('limit') })
	const limit = parsed.success ? parsed.data.limit : 10
	try {
		const headHex = await rpcCall<string>('eth_blockNumber')
		const head = hexToNumber(headHex)
		const blocks = [] as Array<{ number: number; hash: string; timestamp: number; txCount: number }>
		for (let i = 0; i < limit; i++) {
			const n = head - i
			if (n < 0) break
			const blk = await rpcCall<any>('eth_getBlockByNumber', ['0x' + n.toString(16), false])
			blocks.push({ number: n, hash: blk?.hash || '', timestamp: blk?.timestamp ? hexToNumber(blk.timestamp) : 0, txCount: Array.isArray(blk?.transactions) ? blk.transactions.length : (blk?.transactions || 0) })
		}
		return c.json({ blocks })
	} catch (e) {
		return c.json({ blocks: [], todo: true, message: 'See README Open Questions' })
	}
})

// NFT endpoints remain TODO with stable stubs
const NftsCollectionsQuery = z.object({ query: z.string().trim().min(1), limit: z.coerce.number().min(1).max(50).default(10) })
app.get('/api/shape/nfts/collections', async (c) => {
	const parsed = NftsCollectionsQuery.safeParse({ query: c.req.query('query') || '', limit: c.req.query('limit') })
	if (!parsed.success) return c.json({ items: [], message: 'Missing query' }, 400)
	return c.json({ items: [], todo: true, message: 'See README Open Questions' })
})

const NftsByOwnerQuery = z.object({ address: z.string().regex(/^0x[a-fA-F0-9]{40}$/), limit: z.coerce.number().min(1).max(50).default(10) })
app.get('/api/shape/nfts/by-owner', async (c) => {
	const parsed = NftsByOwnerQuery.safeParse({ address: c.req.query('address') || '', limit: c.req.query('limit') })
	if (!parsed.success) return c.json({ items: [], message: 'Invalid address' }, 400)
	return c.json({ address: parsed.data.address, items: [], todo: true, message: 'See README Open Questions' })
})

const NftsByCollectionQuery = z.object({ slug: z.string().trim().min(1), limit: z.coerce.number().min(1).max(50).default(10) })
app.get('/api/shape/nfts/by-collection', async (c) => {
	const parsed = NftsByCollectionQuery.safeParse({ slug: c.req.query('slug') || '', limit: c.req.query('limit') })
	if (!parsed.success) return c.json({ items: [], message: 'Missing slug' }, 400)
	return c.json({ slug: parsed.data.slug, items: [], todo: true, message: 'See README Open Questions' })
})

export default app
