import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../routes/App'

describe('App', () => {
  it('renders title and input', () => {
    render(<App />)
    expect(screen.getByText(/Shape L2 Chat/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
  })
})
