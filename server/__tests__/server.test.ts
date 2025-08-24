import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import app from '../index'
import axios from 'axios'

vi.mock('axios')
const mockedAxios = axios as unknown as { post: ReturnType<typeof vi.fn> }

describe('server', () => {
  beforeEach(() => {
    mockedAxios.post = vi.fn()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('health is ok', async () => {
    const res = await app.request('/api/health')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.ok).toBe(true)
    expect(typeof json.ts).toBe('number')
  })

  it('blockHeight returns number or null', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { result: '0x10' } })
    const res = await app.request('/api/shape/blockHeight')
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(typeof json.height === 'number' || json.height === null).toBe(true)
  })
})
