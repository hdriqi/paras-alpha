import { context, math, u128, PersistentVector, PersistentMap } from 'near-sdk-as'
/** 
 * Exporting a new class PostedMessage so it can be used outside of this file.
 */
@nearBindgen
export class Memento {
  id: string
  name: string
  desc: string
  descRaw: string
  type: string
  owner: string
  createdAt: u64
  user: User | null
}

@nearBindgen
export class Img {
  url: string
  type: string
}

@nearBindgen
export class Post {
  id: string
  originalId: string
  status: string
  body: string
  bodyRaw: string
  imgList: Img[]
  owner: string
  mementoId: string
  createdAt: u64
  user: User | null
  memento: Memento | null
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
export class User {
  id: string
  username: string
  following: Following[]
  imgAvatar: Img
  bio: string
  bioRaw: string
  createdAt: u64
}

@nearBindgen
export class QueryOpts {
  _embed: bool
	_sort: string | null
	_order: string | null
	_limit: i8
}

@nearBindgen
export class PostList {
  data: Post[]
}

@nearBindgen
export class MementoList {
  data: Memento[]
}

@nearBindgen
export class UserList {
  data: User[]
}

export const postCollection = new PersistentMap<string, PostList>("p")
export const mementoCollection = new PersistentMap<string, MementoList>("m")
export const userCollection = new PersistentMap<string, UserList>("u")