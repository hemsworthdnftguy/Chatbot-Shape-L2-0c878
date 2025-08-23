import type { Handler } from '@netlify/functions'
import app from '../../server/index'

export const handler: Handler = async (event, context) => {
  const req = new Request(event.rawUrl, {
    method: event.httpMethod,
    headers: event.headers as any,
    body: event.body,
  })
  const res = await app.fetch(req)
  const body = await res.text()
  return {
    statusCode: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body,
  }
}
