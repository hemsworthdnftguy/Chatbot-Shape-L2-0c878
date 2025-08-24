import { describe, it, expect } from 'vitest'
import app from '../index'

describe('server', () => {
  it('health is ok', async () => {
    const res = await app.request('/api/health')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.status).toBe('ok')
  })

  it('chat validates input', async () => {
    const res = await app.request('/api/chat', { method: 'POST', body: '{}' })
    expect(res.status).toBe(400)
  })
})
