import axios, { AxiosError, AxiosInstance } from 'axios'

const baseURL = import.meta.env.VITE_API_BASE || '/api'

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)) }

export const http: AxiosInstance = axios.create({ baseURL, timeout: 15000 })

http.interceptors.response.use(
	(res) => res,
	async (error: AxiosError) => {
		let cfg = error.config as any
		if (!cfg) throw error
		cfg.__retryCount = cfg.__retryCount || 0
		if (cfg.__retryCount < 2) {
			cfg.__retryCount++
			const backoff = 300 * Math.pow(2, cfg.__retryCount - 1)
			await sleep(backoff)
			return http.request(cfg)
		}
		throw normalizeError(error)
	}
)

export function normalizeError(err: unknown): Error {
	if (axios.isAxiosError(err)) {
		const status = err.response?.status
		const msg = err.response?.data && typeof err.response.data === 'object' ? (err.response.data as any).message : undefined
		return new Error(msg || `HTTP ${status || 'ERR'}`)
	}
	return err instanceof Error ? err : new Error('Unknown error')
}