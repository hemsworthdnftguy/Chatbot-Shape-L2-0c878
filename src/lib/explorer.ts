export type ExplorerEntity = 'tx' | 'address' | 'block'

const DEFAULT_EXPLORER = 'https://explorer.shape.network'

export function getExplorerUrl(type: ExplorerEntity, value: string | number): string {
	const base = DEFAULT_EXPLORER
	if (type === 'tx') return `${base}/tx/${value}`
	if (type === 'address') return `${base}/address/${value}`
	return `${base}/block/${value}`
}