import { z } from 'zod'
import type { Tool } from '@/lib/tools/types'

const Input = z.object({}).strict()

const tool: Tool<z.infer<typeof Input>> = {
	id: 'getShapeInfo',
	label: 'What is Shape L2?',
	description: 'Curated FAQ about Shape L2 and how to build on it',
	inputSchema: Input,
	run: async () => {
		const lines = [
			'What is Shape L2?\n',
			'- Purpose: Shape is an AI-oriented Layer 2 focused on enabling AI agents and apps.\n',
			"- Model: Public L2 chain (EVM-compatible); see docs for consensus/rollup specifics.\n",
			'- Build: Use standard EVM tooling. Start from the Shape builder-kit; wire agents, RPC calls, and indexers as available.\n',
			'- Docs: docs.shape.network/building-on-shape/ai\n',
			'- Builder Kit: github.com/shape-network/builder-kit\n',
			"\nIf any details are unclear or evolve, check the official docs and repos.\n",
		]
		const description = lines.join('')
		return {
			message: 'Here is an overview of Shape L2 and resources to get started.',
			cards: [
				{ id: 'shape_info', title: 'Shape L2 Overview', description },
				{ id: 'shape_docs', title: 'Docs: Building on Shape (AI)', description: 'docs.shape.network/building-on-shape/ai', href: 'https://docs.shape.network/building-on-shape/ai' },
				{ id: 'shape_kit', title: 'Shape Builder Kit', description: 'github.com/shape-network/builder-kit', href: 'https://github.com/shape-network/builder-kit' },
			],
		}
	},
}

export default tool