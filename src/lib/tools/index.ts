import type { Tool, ToolRegistry } from '@/lib/tools/types'
import getBalance from '@/lib/tools/getBalance'
import getTransaction from '@/lib/tools/getTransaction'
import listRecentBlocks from '@/lib/tools/listRecentBlocks'
import searchNFTs from '@/lib/tools/searchNFTs'
import getShapeInfo from '@/lib/tools/getShapeInfo'

export const tools: ToolRegistry = [
	getShapeInfo,
	getBalance,
	getTransaction,
	listRecentBlocks,
	searchNFTs,
]

export type ToolMeta = Pick<Tool, 'id' | 'label' | 'description' | 'fields'>
export const toolMeta: ToolMeta[] = tools.map(({ id, label, description, fields }) => ({ id, label, description, fields }))

export function getToolById(id: string): Tool | undefined {
	return tools.find((t) => t.id === id)
}