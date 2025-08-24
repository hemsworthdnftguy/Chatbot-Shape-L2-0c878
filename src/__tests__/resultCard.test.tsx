import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ResultCard from '@/ui/ResultCard'

describe('ResultCard', () => {
	it('renders title, description and link', () => {
		render(<ResultCard id="1" title="Card" description="Details" href="https://example.com" /> as any)
		expect(screen.getByText('Card')).toBeInTheDocument()
		expect(screen.getByText('Details')).toBeInTheDocument()
		const link = screen.getByText('Open') as HTMLAnchorElement
		expect(link).toBeInTheDocument()
		expect(link.href).toContain('https://example.com')
	})
})