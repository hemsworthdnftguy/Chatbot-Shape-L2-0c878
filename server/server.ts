import app from './index'
import { serve } from '@hono/node-server'

const port = Number(process.env.PORT || 8787)
serve({ fetch: app.fetch, port })
console.log('Server running on http://localhost:' + port)
