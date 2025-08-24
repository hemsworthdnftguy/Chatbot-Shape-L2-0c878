import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import axios from 'axios'
import { z } from 'zod'

const app = new Hono()
app.use('*', logger())
app.use('*', cors())

app.get('/api/health', (c) => c.json({ status: 'ok' }))

// TODO: Replace with real Shape L2 endpoint for head block height from docs
app.get('/api/blocks/head', async (c) => {
  return c.json({ height: null, todo: 'Replace with Shape L2 head height endpoint' })
})

const ChatBody = z.object({ message: z.string().min(1) })
app.post('/api/chat', async (c) => {
  const json = await c.req.json()
  const parsed = ChatBody.safeParse(json)
  if (!parsed.success) return c.json({ message: 'Invalid message' }, 400)

  const msg = parsed.data.message.toLowerCase()
  let assistant = ''
  let toolOutput: any = null
  if (/what is shape/.test(msg)) {
    assistant = 'Shape L2 is an AI-oriented Layer 2 blockchain. [TODO: enrich from official docs]'
  } else if (/block/.test(msg)) {
    assistant = 'Fetching recent blocks…'
    toolOutput = [{ todo: 'Implement listRecentBlocks via Shape API' }]
  } else if (/balance|address/.test(msg)) {
    assistant = 'Fetching balance…'
    toolOutput = { todo: 'Implement getBalance via Shape API' }
  } else if (/nft|collection/.test(msg)) {
    assistant = 'Searching NFTs…'
    toolOutput = [{ todo: 'Implement searchNFTs via OpenSea/Transient/Manifold on Shape' }]
  } else {
    assistant = 'I can help with Shape L2 info, blocks, transactions, and NFTs.'
  }

  return c.json({ assistant, toolOutput })
})

// Shape RPC base URL via env or default; TODO: confirm host
const SHAPE_RPC_URL = process.env.SHAPE_RPC_URL || 'https://mainnet.shape.network'
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || ''

const hexToNumber = (hex: string): number => parseInt(hex, 16)

async function rpcCall<T>(method: string, params: unknown[] = [], signal?: AbortSignal): Promise<T> {
	// Minimal JSON-RPC 2.0 client with retry/backoff
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
			if (res.data?.error) {
				throw new Error(res.data.error?.message || 'RPC error')
			}
			return res.data.result as T
		} catch (err) {
			if (attempt >= 2) throw err
			await new Promise(r => setTimeout(r, delay))
			attempt++
			delay *= 2
		}
	}
}

// GET /api/blocks/head -> { height: number | null }
app.get('/api/blocks/head', async (c) => {
	try {
		const bn = await rpcCall<string>('eth_blockNumber')
		return c.json({ height: hexToNumber(bn) })
	} catch (e) {
		return c.json({ height: null, todo: 'Confirm SHAPE_RPC_URL and endpoint availability' })
	}
})

// GET /api/blocks/recent?limit=10 -> recent blocks summary
app.get('/api/blocks/recent', async (c) => {
	const limit = Math.max(1, Math.min(20, Number(c.req.query('limit') || 10)))
	try {
		const headHex = await rpcCall<string>('eth_blockNumber')
		const head = hexToNumber(headHex)
		const blocks = [] as Array<{ number: number; hash: string; timestamp: number; txCount: number }>
		for (let i = 0; i < limit; i++) {
			const n = head - i
			if (n < 0) break
			const blk = await rpcCall<any>('eth_getBlockByNumber', ['0x' + n.toString(16), false])
			blocks.push({
				number: n,
				hash: blk?.hash || '',
				timestamp: blk?.timestamp ? hexToNumber(blk.timestamp) : 0,
				txCount: Array.isArray(blk?.transactions) ? blk.transactions.length : (blk?.transactions || 0),
			})
		}
		return c.json({ blocks })
	} catch (e) {
		return c.json({ blocks: [], todo: 'listRecentBlocks failed; confirm RPC' })
	}
})

// GET /api/balance/:address -> { address, balanceWei, balanceEther }
const AddressParam = z.string().regex(/^0x[a-fA-F0-9]{40}$/)
app.get('/api/balance/:address', async (c) => {
	const address = c.req.param('address')
	const valid = AddressParam.safeParse(address)
	if (!valid.success) return c.json({ message: 'Invalid address' }, 400)
	try {
		const balHex = await rpcCall<string>('eth_getBalance', [address, 'latest'])
		const wei = BigInt(balHex)
		const ether = Number(wei) / 1e18
		return c.json({ address, balanceWei: wei.toString(), balanceEther: ether })
	} catch (e) {
		return c.json({ address, balanceWei: '0', balanceEther: 0, todo: 'getBalance failed; confirm RPC' })
	}
})

// GET /api/tx/:hash -> tx + receipt summary
const TxHashParam = z.string().regex(/^0x[a-fA-F0-9]{64}$/)
app.get('/api/tx/:hash', async (c) => {
	const hash = c.req.param('hash')
	const valid = TxHashParam.safeParse(hash)
	if (!valid.success) return c.json({ message: 'Invalid tx hash' }, 400)
	try {
		const [tx, receipt] = await Promise.all([
			rpcCall<any>('eth_getTransactionByHash', [hash]),
			rpcCall<any>('eth_getTransactionReceipt', [hash]).catch(() => null),
		])
		return c.json({ tx, receipt })
	} catch (e) {
		return c.json({ tx: null, receipt: null, todo: 'getTransaction failed; confirm RPC' })
	}
})

// POST /api/tx/send { rawTx }
const SendBody = z.object({ rawTx: z.string().regex(/^0x[a-fA-F0-9]+$/) })
app.post('/api/tx/send', async (c) => {
	const body = await c.req.json().catch(() => ({}))
	const parsed = SendBody.safeParse(body)
	if (!parsed.success) return c.json({ message: 'Provide signed rawTx hex' }, 400)
	try {
		const hash = await rpcCall<string>('eth_sendRawTransaction', [parsed.data.rawTx])
		return c.json({ hash })
	} catch (e: any) {
		return c.json({ message: e?.message || 'send failed', todo: 'Integrate wallet or server-side signer later' }, 500)
	}
})

// GET /api/nfts/search?ownerOrCollection=&limit=
app.get('/api/nfts/search', async (c) => {
	const q = (c.req.query('ownerOrCollection') || '').trim()
	const limit = Math.max(1, Math.min(50, Number(c.req.query('limit') || 10)))
	if (!q) return c.json({ items: [], message: 'Missing ownerOrCollection' }, 400)
	// OpenSea v2 typically requires API key; try best-effort, else return helpful links
	try {
		const headers: Record<string, string> = {}
		if (OPENSEA_API_KEY) headers['x-api-key'] = OPENSEA_API_KEY
		// If q looks like a slug, try collection details
		const looksLikeSlug = !q.startsWith('0x')
		if (looksLikeSlug) {
			const url = `https://api.opensea.io/api/v2/collections/${encodeURIComponent(q)}`
			const res = await axios.get(url, { headers, timeout: 10_000 })
			return c.json({ source: 'opensea', collection: res.data })
		} else {
			// Owner address assets (may require key); keep limit small
			const url = `https://api.opensea.io/api/v2/chain/custom/owner/${q}/nfts?limit=${limit}`
			const res = await axios.get(url, { headers, timeout: 10_000 })
			return c.json({ source: 'opensea', items: res.data?.nfts || [] })
		}
	} catch (e) {
		// Graceful fallback with links
		const explorerBase = 'https://shapescan.xyz'
		const fallback = {
			items: [],
			links: {
				collection: !q.startsWith('0x') ? `https://opensea.io/collection/${encodeURIComponent(q)}` : undefined,
				owner: q.startsWith('0x') ? `${explorerBase}/address/${q}` : undefined,
			},
			todo: 'Add OPENSEA_API_KEY to enable rich NFT data',
		}
		return c.json(fallback)
	}
})

export default app
