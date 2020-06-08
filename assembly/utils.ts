import { math, base58 } from 'near-sdk-as'

export function generateId(): string {
	const buff = math.randomBuffer(8)

	var randomId = base58.encode(buff)
	return randomId.replaceAll('/', '')
}