import { Memento, Img, Post, store } from '../model'
import { createPost, getPostList, getPostById, deletePostById } from '../post'
import { createMemento } from '../memento'

var mPublic: Memento = <Memento>{}
var mPermissioned: Memento = <Memento>{}

describe('Memento ', () => {
  beforeEach(() => {
    const name = 'Hello World'
    const desc = 'Memento test'
    const descRaw = 'Memento test raw'
    mPublic = createMemento(name, desc, descRaw, 'public')
    mPermissioned = createMemento(name, desc, descRaw, 'permissioned')

    for (let i = 0; i < 5; i++) {
      const body = 'Hello World'
      const bodyRaw = 'Hello World'
      const imgList: Img[] = []
      const mementoId = mPublic.id
      createPost(body, bodyRaw, imgList, mementoId)
    }

    for (let i = 0; i < 5; i++) {
      const body = 'Hello World'
      const bodyRaw = 'Hello World'
      const imgList: Img[] = []
      const mementoId = mPermissioned.id
      createPost(body, bodyRaw, imgList, mementoId)
    }
  })
  afterEach(() => {
    while(store.mementoList.length > 0) {
      store.mementoList.pop()
    }
    while(store.postList.length > 0) {
      store.postList.pop()
    }
  })

  it('should create published post', () => {
    const body = 'Hello World'
    const bodyRaw = 'Hello World'
    const imgList: Img[] = []
    const mementoId = mPublic.id
    const p = createPost(body, bodyRaw, imgList, mementoId)
    expect(p instanceof Post).toBeTruthy()
    expect(p.status).toBe('published')
  })

  it('should create pending post', () => {
    const body = 'Hello World'
    const bodyRaw = 'Hello World'
    const imgList: Img[] = []
    const mementoId = mPermissioned.id
    const p = createPost(body, bodyRaw, imgList, mementoId)
    expect(p instanceof Post).toBeTruthy()
    expect(p.status).toBe('pending')
  })

  it('should get one post by id', () => {
    const p = store.postList[0]
    const result = getPostById(p.id)
    if(result) {
      expect(result.id).toBe(p.id)
    }
    else {
      expect(result).toBe(null)
    }
  })

  it('should get all post', () => {
    const result = getPostList()
    expect(result.length).toBe(10)
  })

  it('should get all published post', () => {
    const q = new Map<string, string[]>()
    q.set('status', ['published'])

    const result = getPostList(q)
    expect(result.length).toBe(5)
  })

  it('should get all pending post', () => {
    const q = new Map<string, string[]>()
    q.set('status', ['pending'])

    const result = getPostList(q)
    expect(result.length).toBe(5)
  })

  it('should get all post from mementoId', () => {
    const q = new Map<string, string[]>()
    q.set('mementoId', [mPublic.id, mPermissioned.id])

    const result = getPostList(q)
    expect(result.length).toBe(10)
  })

  it('should get all post from originalId', () => {
    const q = new Map<string, string[]>()
    q.set('originalId', [store.postList[0].id])

    const result = getPostList(q)
    expect(result.length).toBe(1)
  })

  it('should get all post sort by createdAt order by desc limit by 5', () => {
    const q = new Map<string, string[]>()
    q.set('originalId', [store.postList[0].id])

    const result = getPostList(null, {
      _embed: true,
      _sort: 'createdAt',
      _order: 'desc',
      _limit: 5
    })
    expect(result.length).toBe(5)
    expect(result[0].createdAt).toBeGreaterThanOrEqual(result[1].createdAt)
  })

  it('should delete post by id', () => {
    const id = store.postList[0].id
    deletePostById(id)
    expect(store.postList.length).toBe(9)
  })
})
