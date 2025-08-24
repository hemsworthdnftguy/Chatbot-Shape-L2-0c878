import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MessageInput from '@/ui/MessageInput'
import { useAppStore } from '@/state/store'

describe('MessageInput', () => {
	beforeEach(() => {
		useAppStore.setState({ messages: [] })
	})

	it('sends on Enter and clears input', () => {
		render(<MessageInput />)
		const textarea = screen.getByLabelText(/Type your message/i)
		fireEvent.change(textarea, { target: { value: 'hello' } })
		fireEvent.keyDown(textarea, { key: 'Enter' })
		expect(useAppStore.getState().messages.at(-1)?.content).toBe('hello')
		expect((textarea as HTMLTextAreaElement).value).toBe('')
	})

	it('adds newline on Shift+Enter and does not send', () => {
		render(<MessageInput />)
		const textarea = screen.getByLabelText(/Type your message/i)
		fireEvent.change(textarea, { target: { value: 'hello' } })
		fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true })
		expect(useAppStore.getState().messages.length).toBe(0)
		expect((textarea as HTMLTextAreaElement).value).toContain('hello')
	})
})