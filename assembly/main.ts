import { context, storage, u128 } from 'near-sdk-as'
import { Memento, Img, mementoCollection, User, userCollection, Post, Content, postCollection, Comment, commentCollection, balances, approves, transactionCollection, Transaction, Event, events } from './model'

const NAME: string = 'Paras Action Coin'
const SYMBOL: string = 'PAC'
const DECIMALS: u8 = 18
const TOTAL_SUPPLY: u128 = u128.fromString("230000000000000000000000000")

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
	const tx = new Transaction("0x", initialOwner, TOTAL_SUPPLY, 'Initial Supply')
	transactionCollection.set(tx.id, tx)
	const ev = new Event('transaction_create', tx.id)
	events.push(ev)
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

export function transfer(to: string, tokens: u128, msg: string = ''): boolean {
	const fromAmount = getBalance(context.sender);
	assert(fromAmount >= tokens, "not enough tokens on account");
	assert(getBalance(to) <= u128.add(getBalance(to), tokens), "overflow at the receiver side");
	balances.set(context.sender, u128.sub(fromAmount, tokens));
	balances.set(to, u128.add(getBalance(to), tokens));
	const tx = new Transaction(context.sender, to, tokens, msg)
	transactionCollection.set(tx.id, tx)
	const ev = new Event('transaction_create', tx.id)
	events.push(ev)
	return true;
}

export function approve(spender: string, tokens: u128): boolean {
	approves.set(context.sender + ":" + spender, tokens);
	return true;
}

export function transferFrom(from: string, to: string, tokens: u128, msg: string = ''): boolean {
	const fromAmount = getBalance(from);
	assert(fromAmount >= tokens, "not enough tokens on account");
	const approvedAmount = allowance(from, to);
	assert(tokens <= approvedAmount, "not enough tokens approved to transfer");
	assert(getBalance(to) <= u128.add(getBalance(to), tokens), "overflow at the receiver side");
	balances.set(from, u128.sub(fromAmount, tokens));
	balances.set(to, u128.add(getBalance(to), tokens));
	const tx = new Transaction(from, to, tokens, msg)
	transactionCollection.set(tx.id, tx)
	const ev = new Event('transaction_create', tx.id)
	events.push(ev)
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
): u128 {
	const tokens = u128.fromString(value)
	const senderBalance = getBalance(context.sender)
	assert(senderBalance >= tokens, 'not enough tokens on account')
	const post = getPostById(postId)
	if (!!post && tokens > u128.from(0)) {
		const memento = getMementoById(post.mementoId)
		const originalPost = getPostById(post.originalId)
		let originalMemento: Memento | null = null

		let postOwnerQuota = 100
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
			transfer(post.owner, forPostOwner, '[Piece] For Post Owner')
		}
		const forMementoOwner = _percent(tokens, postMementoQuota)
		if (!!memento && forMementoOwner > u128.from(0)) {
			// log(forMementoOwner)
			transfer(memento.owner, forMementoOwner, '[Piece] For Memento Owner')
		}
		const forOriginalOwner = _percent(tokens, postOriginalOwnerQuota)
		if (!!originalPost && forOriginalOwner > u128.from(0)) {
			// log(forOriginalOwner)
			transfer(originalPost.owner, forOriginalOwner, '[Piece] For Original Post Owner')
		}
		const forOriginalMemento = _percent(tokens, postOriginalMementoQuota)
		if (!!originalPost && !!originalMemento && forOriginalMemento > u128.from(0)) {
			// log(forOriginalMemento)
			transfer(originalMemento.owner, forOriginalMemento, '[Piece] For Original Memento Owner')
		}
	}
	const latestBalance = getBalance(context.sender)
	return latestBalance
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
	const memento = new Memento(name, category, img, desc, type)

	// check if memento id already taken
	const exist = getMementoById(memento.id)
	assert(
		!exist,
		'Memento id already taken'
	)

	mementoCollection.set(memento.id, memento)
	memento.user = getUserById(memento.owner)

	const ev = new Event('memento_create', memento.id)
	events.push(ev)

	return memento
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
		assert(
			memento.owner == context.sender,
			'Memento can only be deleted by owner'
		)
		memento.img = img
		memento.desc = desc

		mementoCollection.set(id, memento)
		memento.user = getUserById(memento.owner)

		const ev = new Event('memento_update', memento.id)
		events.push(ev)

		return memento
	}
	return null
}

export function archiveMemento(
	id: string
): Memento | null {
	const memento = getMementoById(id)
	if (memento) {
		assert(
			memento.owner == context.sender,
			'Memento can only be deleted by owner'
		)
		memento.isArchive = true

		mementoCollection.set(id, memento)
		memento.user = getUserById(memento.owner)

		const ev = new Event('memento_update', memento.id)
		events.push(ev)

		return memento
	}
	return null
}

export function unarchiveMemento(
	id: string
): Memento | null {
	const memento = getMementoById(id)
	if (memento) {
		assert(
			memento.owner == context.sender,
			'Memento can only be deleted by owner'
		)
		memento.isArchive = false

		mementoCollection.set(id, memento)
		memento.user = getUserById(memento.owner)

		const ev = new Event('memento_update', memento.id)
		events.push(ev)

		return memento
	}
	return null
}

export function deleteMemento(
	id: string
): Memento | null {
	const memento = getMementoById(id)
	if (memento) {
		assert(
			memento.owner == context.sender,
			'Memento can only be deleted by owner'
		)

		mementoCollection.delete(memento.id)
		memento.user = getUserById(memento.owner)

		const ev = new Event('memento_delete', memento.id)
		events.push(ev)

		return memento
	}
	return null
}

export function createPost(
	contentList: Content[],
	mementoId: string
): Post | null {
	const memento = getMementoById(mementoId)
	if (memento) {
		assert(
			!memento.isArchive,
			'Cannot write to archived Memento'
		)
		assert(
			memento.type == 'public' || memento.type == 'personal' && memento.owner == context.sender,
			'Sender does not have access to write to this memento'
		)
		const post = new Post(contentList, mementoId, null)
	
		postCollection.set(post.id, post)
		post.memento = memento
		post.user = getUserById(post.owner)
	
		const ev = new Event('post_create', post.id)
		events.push(ev)
	
		return post
	}
	return null
}

export function transmitPost(
	id: string,
	mementoId: string
): Post | null {
	const post = getPostById(id)
	if (post) {
		const newPost = new Post(post.contentList, mementoId, post.originalId)

		postCollection.set(newPost.id, newPost)
		newPost.memento = getMementoById(newPost.mementoId)
		newPost.user = getUserById(newPost.owner)

		const ev = new Event('post_create', newPost.id)
		events.push(ev)

		return newPost
	}
	return null
}

export function editPost(
	id: string,
	contentList: Content[],
	mementoId: string
): Post | null {
	const post = getPostById(id)
	const memento = getMementoById(mementoId)
	if (!!post && !!memento) {
		assert(
			post.owner == context.sender,
			'Post can only be edited by owner'
		)
		post.contentList = contentList
		post.mementoId = mementoId

		postCollection.set(post.id, post)
		post.memento = memento
		post.user = getUserById(post.owner)

		const ev = new Event('post_update', post.id)
		events.push(ev)

		return post
	}
	return null
}

export function redactPost(
	id: string
): Post | null {
	const post = getPostById(id)
	if (post) {
		const memento = getMementoById(post.mementoId)
		assert(
			!!memento && memento.owner == context.sender,
			'Post can only be redacted by memento owner'
		)

		post.mementoId = ''
		postCollection.set(post.id, post)
		post.user = getUserById(post.owner)

		const ev = new Event('post_update', post.id)
		events.push(ev)

		return post
	}
	return null
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
): Post | null {
	const post = getPostById(id)
	if (post) {
		assert(
			post.owner == context.sender,
			'Post can only be deleted by post owner or memento owner'
		)

		postCollection.delete(post.id)

		const ev = new Event('post_delete', post.id)
		events.push(ev)

		return post
	}
	return null
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

	const ev = new Event('user_create', newUser.id)
	events.push(ev)

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

		const ev = new Event('user_update', user.id)
		events.push(ev)

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

	const ev = new Event('comment_create', c.id)
	events.push(ev)

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
): Comment | null {
	const comment = getCommentById(id)
	if (comment) {
		const post = getPostById(comment.postId)
		assert(
			comment.owner == context.sender || !!post && post.owner == context.sender,
			'Comment can only be deleted by comment owner or post owner'
		)

		commentCollection.delete(comment.id)

		const ev = new Event('comment_delete', comment.id)
		events.push(ev)

		return comment
	}
	return null
}

export function getTransactionById(
	id: string
): Transaction | null {
	const tx = transactionCollection.get(id)
	if (tx) {
		return tx
	}
	return null
}

export function getEventLength(): u64 {
	return events.length
}

export function getEvents(start: i32): Event[] {
	const maxLen = events.length
	assert(
		maxLen > start,
		"Start index is more than current length"
	)
	// only get at most 10 new events
	const diff = min(maxLen - start, 10)
	const result: Event[] = []
	for (let i = start; i < (start + diff); i++) {
		const ev = events[i]
		result.push(ev)
	}
	return result
}