import { ZodSchema } from 'zod'

export type ToolField = {
	name: string
	label: string
	placeholder?: string
	type?: 'text' | 'number'
}

export type ToolResult = {
	message?: string
	cards?: Array<{ id: string; title: string; description?: string; href?: string }>
}

export type Tool<Input = any> = {
	id: string
	label: string
	description: string
	inputSchema: ZodSchema<Input>
	fields?: ToolField[]
	run: (input: Input) => Promise<ToolResult>
}

export type ToolRegistry = Tool<any>[]