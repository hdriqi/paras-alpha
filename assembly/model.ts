import { context, PersistentMap, PersistentVector } from 'near-sdk-as'
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
  createdAt: u64
  user: User | null

  constructor(name: string, category: string, img: Img, desc: string, type: string) {
    const tail = type == 'personal' ? context.sender : category

    this.id = name.concat('.').concat(tail)
    this.name = name
    this.category = category
    this.img = img
    this.desc = desc
    this.type = type
    this.owner = context.sender
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

  constructor(contentList: Content[], mementoId: string) {
    const id = generateId()

    this.id = id
    this.originalId = id
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
  bodyRaw: string
  owner: string
  createdAt: u64
  user: User | null

  constructor(id: string, postId: string, body: string, bodyRaw: string) {
    this.id = id
    this.postId = postId
    this.body = body
    this.bodyRaw = bodyRaw
    this.owner = context.sender
    this.createdAt = context.blockTimestamp
  }
}

@nearBindgen
export class Following {
  id: string
  type: string

  constructor(id: string, type: string) {
    this.id = id
    this.type = type
  }
}

@nearBindgen
export class Feed {
  id: string
  list: Following[]

  constructor(id: string, list: Following[]) {
    this.id = id
    this.list = list
  }
}

@nearBindgen
export class FeedIndex {
  index: u32

  constructor(index: u32) {
    this.index = index
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
export class QueryOpts {
  _embed: bool
  _sort: string | null
  _order: string | null
  _skip: u32
  _limit: u32
}

@nearBindgen
export class SearchResult {
  id: string
  img: Img | null
  title: string
  subtitle: string
  type: string

  constructor(id: string, img: Img | null, title: string, subtitle: string, type: string) {
    this.id = id
    this.img = img
    this.title = title
    this.subtitle = subtitle
    this.type = type
  }
}

export const mementoCollection = new PersistentMap<string, Memento>('memento')
export const postCollection = new PersistentMap<string, Post>('post')
export const userCollection = new PersistentMap<string, User>('user')
export const feedCollection = new PersistentMap<string, Feed>('feed')
export const feedIndex = new PersistentMap<string, FeedIndex>('feedIdx')

// export const postCollection = new PersistentMap<string, PostList>("p")
// export const mementoCollection = new PersistentMap<string, MementoList>("m")

// export const commentCollection = new PersistentMap<string, CommentList>("c")