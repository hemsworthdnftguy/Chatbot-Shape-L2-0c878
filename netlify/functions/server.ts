import app from '../../server/index'
import { handle } from 'hono/netlify'

export const handler = handle(app)
