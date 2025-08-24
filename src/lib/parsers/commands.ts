import { z } from 'zod'
import { getToolById } from '@/lib/tools'

export type ParsedCommand =
	| { type: 'slash'; toolId: string; input: any }
	| { type: 'regex'; toolId: string; input: any }
	| { type: 'none' }

const addressRe = /(0x[a-fA-F0-9]{40})\b/
const txRe = /(0x[a-fA-F0-9]{64})\b/

export function parseInputToTool(text: string): ParsedCommand {
	const trimmed = text.trim()
	if (trimmed.startsWith('/')) {
		const [cmd, ...rest] = trimmed.slice(1).split(/\s+/)
		if (cmd === 'balance') {
			const maybe = rest[0] || ''
			return { type: 'slash', toolId: 'getBalance', input: { address: maybe } }
		}
		if (cmd === 'tx') {
			const maybe = rest[0] || ''
			return { type: 'slash', toolId: 'getTransaction', input: { hash: maybe } }
		}
		if (cmd === 'blocks') {
			const n = Number(rest[0] || '10')
			return { type: 'slash', toolId: 'listRecentBlocks', input: { limit: n } }
		}
		if (cmd === 'nfts') {
			const q = rest[0] || ''
			return { type: 'slash', toolId: 'searchNFTs', input: { query: q, mode: 'collections', limit: 10 } }
		}
	}
	// regex rules
	const addr = trimmed.match(addressRe)?.[1]
	if (addr) return { type: 'regex', toolId: 'getBalance', input: { address: addr } }
	const tx = trimmed.match(txRe)?.[1]
	if (tx) return { type: 'regex', toolId: 'getTransaction', input: { hash: tx } }
	return { type: 'none' }
}

export function validateToolInput(toolId: string, input: any): { ok: boolean; data?: any; error?: string } {
	const tool = getToolById(toolId)
	if (!tool) return { ok: false, error: 'Unknown tool' }
	const result = tool.inputSchema.safeParse(input)
	if (!result.success) return { ok: false, error: 'Invalid input' }
	return { ok: true, data: result.data }
}