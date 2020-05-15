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
  memento: Memento | null
}

@nearBindgen
export class Store {
  mementoList: Memento[]
  postList: Post[]

  constructor() {
    this.mementoList = []
    this.postList = []
  }
}

export const store = new Store()