import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'sonner'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)) }

export const http: AxiosInstance = axios.create({ baseURL, timeout: 15000 })

http.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		const cfg: any = error.config || {}
		const status = error.response?.status
		const retriable = !status || status >= 500
		cfg.__retryCount = cfg.__retryCount || 0
		if (retriable && cfg.__retryCount < 2) {
			cfg.__retryCount++
			const backoff = 400 * Math.pow(2, cfg.__retryCount - 1)
			await sleep(backoff)
			return http.request(cfg)
		}
		const err = normalizeError(error, cfg.__retryCount || 0)
		toast.error(err.message)
		throw err
	}
)

export function normalizeError(err: unknown, retries = 0): Error {
	if (axios.isAxiosError(err)) {
		const status = err.response?.status
		const msg = err.response?.data && typeof err.response.data === 'object' ? (err.response.data as any).message : undefined
		const base = msg || (status ? `Request failed with status ${status}` : 'Network error')
		const suffix = retries > 0 ? ` (retried ${retries}x)` : ''
		return new Error(base + suffix)
	}
	return err instanceof Error ? err : new Error('Unknown error')
}