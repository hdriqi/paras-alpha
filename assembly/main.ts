import { context, math, base58, logging } from 'near-sdk-as'
import { Memento, Img, mementoCollection, User, userCollection, Post, Content, postCollection, Following, feedCollection, feedIndex, Feed, FeedIndex } from './model'

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


export function createPost(
	contentList: Content[],
	mementoId: string
): Post {
	const p = new Post(contentList, mementoId)

	postCollection.set(p.id, p)

	return p
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
		const memento = getMementoById(post.mementoId)
		assert(
			post.owner == context.sender || !!memento && memento.owner == context.sender,
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

export function getFeedById(id: string): Feed | null {
	
	const feed = feedCollection.get(id)
	if(feed) {
		return feed
	}
	return null
}

export function toggleFollow(target: Following): boolean {
	const feedId = math.hash32(context.sender).toString()

	const feed = getFeedById(feedId)
	const feedIdx = feedId.concat('->').concat(target.id)
	if (feed) {
		const isFollowing = feedIndex.get(feedIdx)
		// if already following, set to unfollow target
		if (isFollowing) {
			feed.list.splice(isFollowing.index, 1)
			feed.id = feedId
			feedCollection.set(feedId, feed)
			feedIndex.delete(feedId.concat('->').concat(target.id))
		}
		// else follow target
		else {
			feed.list.push(target)
			feed.id = feedId
			feedCollection.set(feedId, feed)
			const idx = new FeedIndex(feed.list.length - 1)
			feedIndex.set(feedId.concat('->').concat(target.id), idx)
		}
		
		return true
	}

	const newFeed = new Feed(feedId, [target])
	feedCollection.set(feedId, newFeed)
	const idx = new FeedIndex(0)
	feedIndex.set(feedIdx, idx)
	return true
}