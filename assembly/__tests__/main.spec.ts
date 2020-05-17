import { Memento, Img, Post, postCollection, mementoCollection } from '../model'
import { createPost, getPostList, getPostById, deletePostById, createMemento } from '../main'

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
      const body = 'Hello World '.concat(i.toString())
      const bodyRaw = 'Hello World'
      const imgList: Img[] = []
      const mementoId = mPublic.id
      createPost(body, bodyRaw, imgList, mementoId)
    }

    for (let i = 0; i < 5; i++) {
      const body = 'Hola World '.concat(i.toString())
      const bodyRaw = 'Hello World'
      const imgList: Img[] = []
      const mementoId = mPermissioned.id
      createPost(body, bodyRaw, imgList, mementoId)
    }
  })
  afterEach(() => {
    postCollection.delete('list')
    mementoCollection.delete('list')
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
    const list = postCollection.get('list')
    if(list) {
      const p = list.data[0]
      const result = getPostById(p.id)
      if(result) {
        expect(result.id).toBe(p.id)
      }
      else {
        expect(result).toBe(null)
      }
    }
  })

  it('should get all post', () => {
    const result = getPostList()
    expect(result.length).toBe(10)
  })

  it('should get all post sorted by createdAt & desc', () => {
    const result = getPostList([], {
      _embed: true,
      _sort: 'createdAt',
      _order: 'desc',
      _skip: 0,
      _limit: 10
    })
    expect(result[0].createdAt).toBeGreaterThanOrEqual(result[result.length - 1].createdAt)
  })

  it('should get all published post', () => {
    const q = ['status:=published']
    const result = getPostList(q)
    expect(result.length).toBe(5)
  })

  it('should get all pending post', () => {
    const q = ['status:=pending']
    const result = getPostList(q)
    expect(result.length).toBe(5)
  })

  it('should get all post from mementoId', () => {
    const qMementoId = 'mementoId:='.concat(mPublic.id).concat(',').concat(mPermissioned.id)
    const q = [qMementoId]
    const result = getPostList(q)
    expect(result.length).toBe(10)
  })

  it('should get all post from originalId', () => {
    const list = postCollection.get('list')
    if(list) {
      const qOriginalId = 'originalId:='.concat(list.data[0].id)
      const q = [qOriginalId]
      const result = getPostList(q)
      expect(result.length).toBe(1)
    }
  })

  it('should get all post sort by createdAt order by desc limit by 5', () => {
    const list = postCollection.get('list')
    if(list) {
      const result = getPostList(null, {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _skip: 0,
        _limit: 5
      })
      expect(result.length).toBe(5)
      expect(result[0].createdAt).toBeGreaterThanOrEqual(result[1].createdAt)
    }
  })

  it('should get all post sort by createdAt order by desc skip by 3 limit by 3', () => {
    const list = postCollection.get('list')
    if(list) {
      const result = getPostList(null, {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _skip: 3,
        _limit: 3
      })
      expect(result.length).toBe(3)
      expect(result[0].body).toBe('Hello World 3')
    }
  })

  it('should delete post by id', () => {
    const list = postCollection.get('list')
    if(list) {
      const id = list.data[0].id
      deletePostById(id)
      const postList = getPostList()
      expect(postList.length).toBe(9)
    }
  })
})
