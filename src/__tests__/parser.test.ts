import { describe, it, expect } from 'vitest'
import { parseInputToTool } from '@/lib/parsers/commands'

describe('parser', () => {
	it('maps /balance to getBalance', () => {
		const p = parseInputToTool('/balance 0x1234567890abcdef1234567890abcdef12345678')
		expect(p).toMatchObject({ type: 'slash', toolId: 'getBalance' })
	})
	it('regex maps 0xaddress to balance', () => {
		const p = parseInputToTool('balance 0x1234567890abcdef1234567890abcdef12345678 please')
		expect(p).toMatchObject({ type: 'regex', toolId: 'getBalance' })
	})
	it('regex maps 0xhash to tx', () => {
		const p = parseInputToTool('check tx 0x' + 'a'.repeat(64))
		expect(p).toMatchObject({ type: 'regex', toolId: 'getTransaction' })
	})
})