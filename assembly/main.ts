import { context, math, base58 } from 'near-sdk-as'
import { Memento, Img, mementoCollection, User, userCollection, Post, Content, postCollection } from './model'

export function createMemento(
	name: string, 
	category: string,
	img: Img,
	desc: string, 
	type: string
): Memento {
	assert(
		type == 'public' || type == 'personal', 
		'Memento type must be public or personal'
	)
	const m = new Memento(name, category, img, desc, type)

	mementoCollection.set(m.id, m)
	
	return m
}

export function createPost(
  contentList: Content[],
  mementoId: string
): Post {
  const p = new Post(contentList, mementoId)

  postCollection.set(p.id, p)

  return p
}

export function getUserByUsername(username: string): User | null {
	let result: User | null = null
	const userList = userCollection.get('list')
	if(!userList) {
		return null
	}
	for (let idx = 0; idx < userList.data.length; idx++) {
		const user = userList.data[idx]
		if(user.username == username) {
			result = user
			break
		}
	}
	if(result) {
		return result
	}
	else {
		return null
	}
}