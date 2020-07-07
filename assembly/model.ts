import { context, PersistentMap, PersistentVector, u128 } from 'near-sdk-as'
import { generateId } from './utils'

@nearBindgen
export class Img {
  url: string
  type: string
}

@nearBindgen
export class Link {
  img: Img
  title: string
  desc: string
  url: string
}

@nearBindgen
export class Content {
  type: string
  body: string
}

@nearBindgen
export class Memento {
  id: string
  name: string
  category: string
  img: Img
  desc: string
  type: string
  owner: string
  isArchive: bool
  createdAt: u64
  user: User | null

  constructor(name: string, category: string, img: Img, desc: string, type: string) {
    const tail = type == 'personal' ? context.sender.split('.')[0] : category

    this.id = name.concat('.').concat(tail)
    this.name = name
    this.category = category
    this.img = img
    this.desc = desc
    this.type = type
    this.owner = context.sender
    this.isArchive = false
    this.createdAt = context.blockTimestamp
  }
}

@nearBindgen
export class Post {
  id: string
  originalId: string
  contentList: Content[]
  owner: string
  mementoId: string
  createdAt: u64
  user: User | null
  memento: Memento | null

  constructor(contentList: Content[], mementoId: string, originalId: string | null) {
    const id = generateId()

    this.id = id
    this.originalId = originalId ? originalId : id
    this.contentList = contentList
    this.mementoId = mementoId
    this.owner = context.sender
    this.createdAt = context.blockTimestamp
  }
}

@nearBindgen
export class Comment {
  id: string
  postId: string
  body: string
  owner: string
  createdAt: u64
  user: User | null

  constructor(postId: string, body: string) {
    this.id = generateId()
    this.postId = postId
    this.body = body
    this.owner = context.sender
    this.createdAt = context.blockTimestamp
  }
}

@nearBindgen
export class User {
  id: string
  imgAvatar: Img
  bio: string
  createdAt: u64

  constructor(imgAvatar: Img, bio: string) {
    this.id = context.sender
    this.imgAvatar = imgAvatar
    this.bio = bio
    this.createdAt = context.blockTimestamp
  }
}

@nearBindgen
export class Transaction {
  id: string
  from: string
  to: string
  value: u128
  msg: string
  createdAt: u64

  constructor(from: string, to: string, value: u128, msg: string) {
    this.id = generateId()
    this.from = from
    this.to = to
    this.value = value
    this.msg = msg
    this.createdAt = context.blockTimestamp
  }
}

@nearBindgen
export class Event {
  id: string
  msg: string
  params: string
  createdAt: u64

  constructor(msg: string, params: string) {
    this.id = events.length.toString()
    this.msg = msg
    this.params = params
    this.createdAt = context.blockTimestamp
  }
}

export const mementoCollection = new PersistentMap<string, Memento>('memento')
export const postCollection = new PersistentMap<string, Post>('post')
export const userCollection = new PersistentMap<string, User>('user')
export const commentCollection = new PersistentMap<string, Comment>('comment')
export const transactionCollection = new PersistentMap<string, Transaction>('pac:tx')
export const balances = new PersistentMap<string, u128>("pac:b")
export const approves = new PersistentMap<string, u128>("pac:a")
export const events = new PersistentVector<Event>('event')