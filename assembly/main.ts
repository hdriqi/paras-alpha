import { context, math } from 'near-sdk-as'
import { Memento, Img, mementoCollection, User, userCollection, Post, Content, postCollection, Comment, commentCollection } from './model'

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

	// check if memento id already taken
	const exist = getMementoById(m.id)
	assert(
		!exist,
		'Memento id already taken'
	)

	mementoCollection.set(m.id, m)

	return m
}

export function getMementoById(
	id: string
): Memento | null {
	const memento = mementoCollection.get(id)
	if (memento) {
		return memento
	}
	return null
}

export function updateMemento(
	id: string,
	img: Img,
	desc: string
): Memento | null {
	const memento = getMementoById(id)
	if (memento) {
		memento.img = img
		memento.desc = desc

		mementoCollection.set(id, memento)

		return memento
	}
	return null
}

export function deleteMemento(
	id: string
): boolean {
	const memento = getMementoById(id)
	if (memento) {
		assert(
			memento.owner == context.sender,
			'Memento can only be deleted by owner'
		)

		mementoCollection.delete(memento.id)
	}
	return true
}

export function createPost(
	contentList: Content[],
	mementoId: string
): Post {
	const p = new Post(contentList, mementoId, null)

	postCollection.set(p.id, p)

	return p
}

export function transmitPost(
	id: string,
	mementoId: string
): Post | null {
	const post = getPostById(id)
	if (post) {
		const p = new Post(post.contentList, mementoId, post.originalId)

		postCollection.set(p.id, p)

		return p
	}
	return null
}

export function editPost(
	id: string,
	contentList: Content[],
	mementoId: string
): Post | null {
	const post = getPostById(id)
	if (post) {
		post.contentList = contentList
		post.mementoId = mementoId

		postCollection.set(post.id, post)
		return post
	}
	return null
}

export function redactPost(
	id: string
): boolean {
	const post = getPostById(id)
	if (post) {
		const memento = getMementoById(post.mementoId)
		assert(
			!!memento && memento.owner == context.sender,
			'Post can only be redacted by memento owner'
		)

		post.mementoId = ''
		postCollection.set(post.id, post)
	}
	return true
}

export function getPostById(
	id: string
): Post | null {
	const post = postCollection.get(id)
	if (post) {
		return post
	}
	return null
}

export function deletePost(
	id: string
): boolean {
	const post = getPostById(id)
	if (post) {
		assert(
			post.owner == context.sender,
			'Post can only be deleted by post owner or memento owner'
		)

		postCollection.delete(post.id)
	}
	return true
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

export function updateUser(
	imgAvatar: Img,
	bio: string
): User | null {
	const user = getUserById(context.sender)
	if (user) {
		user.imgAvatar = imgAvatar
		user.bio = bio

		userCollection.set(context.sender, user)

		return user
	}
	return null
}

export function createComment(
	postId: string,
	body: string
): Comment {
	const c = new Comment(postId, body)

	commentCollection.set(c.id, c)

	return c
}

export function getCommentById(id: string): Comment | null {
	const comment = commentCollection.get(id)
	if (comment) {
		return comment
	}
	return null
}

export function deleteComment(
	id: string
): boolean {
	const comment = getCommentById(id)
	if (comment) {
		const post = getPostById(comment.postId)
		assert(
			comment.owner == context.sender || !!post && post.owner == context.sender,
			'Comment can only be deleted by comment owner or post owner'
		)

		commentCollection.delete(comment.id)
	}
	return true
}