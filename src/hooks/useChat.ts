import { useState, useCallback } from 'react'
import { useAppStore } from '@/state/store'
import { parseInputToTool, validateToolInput } from '@/lib/parsers/commands'
import { getToolById } from '@/lib/tools'
import type { ToolResult } from '@/lib/tools/types'

export type ChatUIState = {
	pendingTool?: { toolId: string; input: any; source: 'slash' | 'regex' }
	isRunning: boolean
}

export default function useChat() {
	const addMessage = useAppStore((s) => s.addMessage)
	const addResult = useAppStore((s) => s.addResult)
	const [ui, setUi] = useState<ChatUIState>({ isRunning: false })

	const submitText = useCallback((text: string) => {
		addMessage('user', text)
		const parsed = parseInputToTool(text)
		if (parsed.type === 'none') return
		const valid = validateToolInput(parsed.toolId, parsed.input)
		if (!valid.ok) return
		setUi({ pendingTool: { toolId: parsed.toolId, input: valid.data, source: parsed.type }, isRunning: false })
	}, [addMessage])

	const runPending = useCallback(async () => {
		if (!ui.pendingTool) return
		const tool = getToolById(ui.pendingTool.toolId)
		if (!tool) return
		setUi((s) => ({ ...s, isRunning: true }))
		let result: ToolResult | null = null
		try {
			result = await tool.run(ui.pendingTool.input)
		} catch (e: any) {
			result = { message: e?.message || 'Tool failed' }
		}
		if (result?.message) addMessage('assistant', result.message)
		if (Array.isArray(result?.cards)) result.cards.forEach((c) => addResult({ id: c.id, title: c.title, description: c.description, href: c.href }))
		setUi({ isRunning: false, pendingTool: undefined })
	}, [ui.pendingTool, addMessage, addResult])

	const cancelPending = useCallback(() => setUi({ isRunning: false, pendingTool: undefined }), [])

	return { ui, submitText, runPending, cancelPending }
}