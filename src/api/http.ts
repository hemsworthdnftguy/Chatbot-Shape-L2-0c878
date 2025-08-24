import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { ZodSchema } from 'zod'

const http = axios.create({
	baseURL: '',
	headers: { 'content-type': 'application/json' },
	timeout: 10000,
})

export async function requestWithRetry<T = any>(config: AxiosRequestConfig, retries = 2): Promise<T> {
	let attempt = 0
	let delay = 300
	while (true) {
		try {
			const res = await http.request<T>(config)
			return res.data
		} catch (err) {
			const ax = err as AxiosError
			const status = ax.response?.status
			const retriable = !status || (status >= 500 && status < 600)
			if (!retriable || attempt >= retries) throw err
			await new Promise(r => setTimeout(r, delay))
			attempt++
			delay *= 2
		}
	}
}

export function parseWith<T>(schema: ZodSchema<T>, data: unknown, friendly = 'Invalid response'): T {
	const out = schema.safeParse(data)
	if (!out.success) {
		const issue = out.error.issues?.[0]
		const message = issue?.message || friendly
		throw new Error(message)
	}
	return out.data
}