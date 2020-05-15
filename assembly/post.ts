import { context, math, base64 } from 'near-sdk-as'
import { Post, Img, store } from './model'
import { getMementoById } from './memento'

const LIMIT = 10

function _genId(): string {
	const buff = math.randomBuffer(8)
	
  var randomId = base64.encode(buff)
	return randomId.toLowerCase()
}

export function createPost(
  body: string,
  bodyRaw: string,
  imgList: Img[],
  mementoId: string
): Post {
  // get memento and check its type
  const m = getMementoById(mementoId)
  assert(
    !!m,
    'Memento is deleted'
  )
  const id = _genId()
  const status = !!m && m.type == 'public' ? 'published' : 'pending'
  
	const p = new Post()
  p.id = id
  p.originalId = id
  p.status = status
	p.body = body
  p.bodyRaw = bodyRaw
  p.imgList = imgList
  p.owner = context.sender
  p.mementoId = mementoId
  p.createdAt = Date.now()

  store.postList.push(p)
  return p
}

class QueryOpts {
  _embed: bool
	_sort: string | null
	_order: string | null
	_limit: i8
}

function _addToPostList(post: Post, embed: bool, result: Post[]): void {
  if(embed) {
    const memento = getMementoById(post.mementoId)
    if(!!memento) post.memento = memento
  }
  result.push(post)
}

export function getPostList(
  query: Map<string, string[]> | null = null,
  opts: QueryOpts = {
    _embed: true,
    _sort: null,
    _order: null,
    _limit: 10
  }
): Post[] {
	const result: Post[] = []
	for (let idx = 0; idx < store.postList.length; idx++) {
    const post = store.postList[idx]
		if(query) {
      const queryKeys = query.keys()
      const matches: bool[] = new Array<bool>(queryKeys.length)
      for (let i = 0; i < queryKeys.length; i++) {
        const key = queryKeys[i]
        const val = query.get(key)
        if(
          (key == 'status' && val.includes(post.status)) ||
          (key == 'originalId' && val.includes(post.originalId)) ||
          (key == 'owner' && val.includes(post.owner)) ||
          (key == 'mementoId' && val.includes(post.mementoId))
        ) {
          matches[i] = true
        }
      }
      if(matches.every(match => match == true)) {
        _addToPostList(post, opts._embed, result)
      }
		}
		else {
      _addToPostList(post, opts._embed, result)
		}
	}
	if(!!opts && !!opts._sort) {
		if(opts._sort == 'createdAt') {
			if(!!opts._order && opts._order == 'desc') {
				result.sort((a, b) => (b.createdAt - a.createdAt) as i32)
			}
		}
  }
	if(!!opts && opts._limit > 0) {
		return result.slice(0, Math.min(LIMIT, opts._limit) as i32)
	}
	return result.slice(0, LIMIT)
}

export function getPostById(id: string): Post | null {
	const result: Post[] = []
	for (let idx = 0; idx < store.postList.length; idx++) {
		const post = store.postList[idx]
		if(post.id == id) {
			result.push(post)
			break
		}
	}
	if(result.length > 0) {
		return result[0]
	}
	else {
		return null
	}
}

export function deletePostById(id: string): Post | null {
  let idx = -1
  for (let i = 0; i < store.postList.length; i++) {
		const post = store.postList[i]
		if(post.id == id) {
      const m = getMementoById(post.mementoId)
      assert(
        post.owner == context.sender || !!m && m.owner == context.sender,
        'Post can only be deleted by post owner or memento owner'
      )
      idx = i
			break
		}
  }
  if(idx > -1) {
    const p = store.postList[idx]
    store.postList.splice(idx, 1)
    return p
  }
  return null
}