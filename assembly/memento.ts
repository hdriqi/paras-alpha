import { context, math, base64 } from "near-sdk-as"
import { Memento, store } from "./model"

/**
 * Adds a new message under the name of the sender's account id.\
 * NOTE: This is a change method. Which means it will modify the state.\
 * But right now we don't distinguish them with annotations yet.
 */

function _genId(): string {
	const buff = math.randomBuffer(8)
	
	var randomId = base64.encode(buff)
	return randomId.toLowerCase()
}

export function createMemento(
	name: string, 
	desc: string, 
	descRaw: string, 
	type: string
): Memento {
	const id = _genId()
	// const createdAt = context.blockTimestamp
	// const blockIdx = context.blockIndex
	// log(createdAt)

	assert(
		type === 'public' || type === 'permissioned', 
		'Memento type must be public or permissioned'
	)
	const m = new Memento()
	m.id = id
	m.name = name
	m.desc = desc
	m.descRaw = descRaw
	m.type = type
	m.owner = context.sender
	m.createdAt = Date.now()

	store.mementoList.push(m)
	return m
}

class Query {
	_sort: string | null
	_order: string | null
	_limit: i8
}

class MementoQuery extends Query {
	name: string | null
	nameLike: string | null
	owner: string | null
}

export function getMementoList(query: MementoQuery = {
	name: null, 
	nameLike: null,
	owner: null,
	_sort: null,
	_order: null,
	_limit: 10
}): Memento[] {
	const result: Memento[] = []
	for (let idx = 0; idx < store.mementoList.length; idx++) {
		const memento = store.mementoList[idx]
		if(query.name != null || query.nameLike != null || query.owner != null) {
			if(query.name != null && query.name == memento.name) {
				result.push(memento)
			}
			if(query.nameLike != null && memento.name.toLowerCase().indexOf(query.nameLike.toString()) > -1) {
				result.push(memento)
			}
			if(query.owner != null && query.owner == memento.owner) {
				result.push(memento)
			}
		}
		else {
			result.push(memento)
		}
	}
	if(query._sort) {
		if(query._sort === 'createdAt') {
			if(query._order === 'desc') {
				result.sort((a, b) => b.createdAt as u32 - a.createdAt as u32)
			}
		}
	}
	if(query._limit) {
		return result.slice(0, query._limit)
	}
	return result
}

export function getMementoById(id: string): Memento | null {
	const result: Memento[] = []
	for (let idx = 0; idx < store.mementoList.length; idx++) {
		const memento = store.mementoList[idx]
		if(memento.id == id) {
			result.push(memento)
			break
		}
	}
	if(result.length > 0) {
		return result[0]
	}
	else {
		return null
	}
}