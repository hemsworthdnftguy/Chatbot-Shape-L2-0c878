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

export default app
