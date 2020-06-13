import { context, storage, logging, u128 } from 'near-sdk-as'
import { Memento, Img, mementoCollection, User, userCollection, Post, Content, postCollection, Comment, commentCollection, balances, approves, transactions, Transaction } from './model'

const NAME: string = 'Paras Action Coin'
const SYMBOL: string = 'PAC'
const DECIMALS: u8 = 18
const TOTAL_SUPPLY: u128 = u128.fromString("23000000000000000000000000")

export function name(): string {
	return NAME
}

export function symbol(): string {
	return SYMBOL
}

export function decimals(): u8 {
	return DECIMALS
}

export function totalSupply(): u128 {
	return TOTAL_SUPPLY
}

export function init(initialOwner: string): void {
	assert(storage.get<string>("init") == null, "Already initialized token supply");
	balances.set(initialOwner, TOTAL_SUPPLY);
	storage.set("init", "done");
}

export function balanceOf(tokenOwner: string): u128 {
	if (!balances.contains(tokenOwner)) {
		return u128.fromI32(0);
	}
	const result = balances.getSome(tokenOwner);
	return result;
}

export function allowance(tokenOwner: string, spender: string): u128 {
	const key = tokenOwner + ":" + spender;
	if (!approves.contains(key)) {
		return u128.fromI32(0);
	}
	return approves.getSome(key);
}

export function transfer(to: string, tokens: u128): boolean {
	const fromAmount = getBalance(context.sender);
	assert(fromAmount >= tokens, "not enough tokens on account");
	assert(getBalance(to) <= u128.add(getBalance(to), tokens), "overflow at the receiver side");
	balances.set(context.sender, u128.sub(fromAmount, tokens));
	balances.set(to, u128.add(getBalance(to), tokens));
	const tx = new Transaction(context.sender, to, tokens)
	transactions.push(tx)
	return true;
}

export function approve(spender: string, tokens: u128): boolean {
	approves.set(context.sender + ":" + spender, tokens);
	return true;
}

export function transferFrom(from: string, to: string, tokens: u128): boolean {
	const fromAmount = getBalance(from);
	assert(fromAmount >= tokens, "not enough tokens on account");
	const approvedAmount = allowance(from, to);
	assert(tokens <= approvedAmount, "not enough tokens approved to transfer");
	assert(getBalance(to) <= u128.add(getBalance(to), tokens), "overflow at the receiver side");
	balances.set(from, u128.sub(fromAmount, tokens));
	balances.set(to, u128.add(getBalance(to), tokens));
	const tx = new Transaction(from, to, tokens)
	transactions.push(tx)
	return true;
}

function getBalance(owner: string): u128 {
	return balances.contains(owner) ? balances.getSome(owner) : u128.fromI32(0);
}

function _percent(value: u128, percent: u32): u128 {
	return u128.div(u128.mul(value, u128.from(percent)), u128.from(100))
}

export function piecePost(
	postId: string,
	value: string
): boolean {
	const tokens = u128.fromString(value)
	const senderBalance = getBalance(context.sender)
	assert(senderBalance >= tokens, 'not enough tokens on account')
	const post = getPostById(postId)
	if (!!post && tokens > u128.from(0)) {
		const memento = getMementoById(post.mementoId)
		const originalPost = getPostById(post.originalId)
		let originalMemento: Memento | null = null

		let postOwnerQuota = 1
		let postMementoQuota = 0
		let postOriginalOwnerQuota = 0
		let postOriginalMementoQuota = 0
		if (memento) {
			postOwnerQuota = 90
			postMementoQuota = 10
			if (post.id != post.originalId) {
				if (originalPost) {
					postOwnerQuota = 5
					postMementoQuota = 5
					postOriginalOwnerQuota = 90
					originalMemento = getMementoById(originalPost.id)
					if (originalMemento) {
						postOriginalOwnerQuota = 80
						postOriginalMementoQuota = 10
					}
				}
			}
		}
		const forPostOwner = _percent(tokens, postOwnerQuota)
		if (forPostOwner > u128.from(0)) {
			// log(forPostOwner)
			transfer(post.owner, forPostOwner)
		}
		const forMementoOwner = _percent(tokens, postMementoQuota)
		if (!!memento && forMementoOwner > u128.from(0)) {
			// log(forMementoOwner)
			transfer(memento.owner, forMementoOwner)
		}
		const forOriginalOwner = _percent(tokens, postOriginalOwnerQuota)
		if (!!originalPost && forOriginalOwner > u128.from(0)) {
			// log(forOriginalOwner)
			transfer(originalPost.owner, forOriginalOwner)
		}
		const forOriginalMemento = _percent(tokens, postOriginalMementoQuota)
		if (!!originalPost && !!originalMemento && forOriginalMemento > u128.from(0)) {
			// log(forOriginalMemento)
			transfer(originalMemento.owner, forOriginalMemento)
		}
	}
	return true
}

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
