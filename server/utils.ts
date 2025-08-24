export function formatUnits(valueHexOrWei: string | bigint, decimals: number = 18): string {
	const value = typeof valueHexOrWei === 'string' && valueHexOrWei.startsWith('0x') ? BigInt(valueHexOrWei) : BigInt(valueHexOrWei)
	const base = BigInt(10) ** BigInt(decimals)
	const whole = value / base
	const frac = value % base
	const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '')
	return fracStr.length > 0 ? `${whole.toString()}.${fracStr}` : whole.toString()
}