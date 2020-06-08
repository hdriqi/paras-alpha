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

export function getUserById(id: string): User | null {
	const user = userCollection.get(id)
	if (user) {
		return user
	}
	return null
}

export function createUser(imgAvatar: Img, bio: string): User {
	const userExist = getUserById(context.sender)
	assert(
		!userExist,
		'User already exist'
	)

	const newUser = new User(imgAvatar, bio)

	userCollection.set(newUser.id, newUser)

	return newUser
}