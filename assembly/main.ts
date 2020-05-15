import { context, math, base58 } from 'near-sdk-as'
import { Post, Memento, Img, QueryOpts, postCollection, mementoCollection, MementoList, PostList, User, userCollection, UserList, Following } from './model'

const LIMIT = 10

function _genId(): string {
	const buff = math.randomBuffer(8)
	
	var randomId = base58.encode(buff)
	return randomId.replaceAll('/', '').toLowerCase()
}

export function devDeleteAllMemento(): bool {
  mementoCollection.delete('list')
  return true
}

export function devDeleteAllPost(): bool {
  postCollection.delete('list')
  return true
}

export function devDeleteAllUser(): User[] {
  userCollection.delete('list')
  const userList = getUserList()
  return userList
}

export function createMemento(
	name: string, 
	desc: string, 
	descRaw: string, 
	type: string
): Memento {
	const id = _genId()

	assert(
		type == 'public' || type == 'permissioned', 
		'Memento type must be public or permissioned'
  )
	const m = new Memento()
	m.id = id
	m.name = name
	m.desc = desc
	m.descRaw = descRaw
	m.type = type
	m.owner = context.sender
	m.createdAt = 123123123

	const list = mementoCollection.get('list')
  if(list) {
    list.data.push(m)
    mementoCollection.set('list', list)
  }
  else {
    const newList = new MementoList()
    newList.data = [m]
    mementoCollection.set('list', newList)
  }
	return m
}

function _addToMementoList(memento: Memento, embed: bool, result: Memento[]): void {
  if(embed) {
    const user = getUserByUsername(memento.owner)
    if(!!memento) memento.user = user
  }
  result.push(memento)
}

/**
 * 
 * @param query [id, name, owner, type]
 * @param opts 
 */
export function getMementoList(
  query: string[] | null = null,
  opts: QueryOpts = {
    _embed: true,
    _sort: null,
    _order: null,
    _limit: 10
}): Memento[] {
  const result: Memento[] = []
  const mementoList = mementoCollection.get('list')
  if(!mementoList) {
    return []
  }

  for (let idx = 0; idx < mementoList.data.length; idx++) {
    const memento: Memento = mementoList.data[idx]
		if(query) {
      const matches: bool[] = new Array<bool>(query.length)
      for (let i = 0; i < query.length; i++) {
        // split key and val
        const splitted = query[i].split(':=')
        const key = splitted[0]
        const val = splitted[1]

        if(key == 'name_like') {
          const splittedVal = val.split(',')
          for (let j = 0; j < splittedVal.length; j++) {
            if(memento.name.toLowerCase().indexOf(splittedVal[j].toLowerCase()) > -1) {
              matches[i] = true
            }
          }
        }
        if(
          (key == 'id' && val.split(',').includes(memento.id)) ||
          (key == 'name' && val.split(',').includes(memento.name)) ||
          (key == 'owner' && val.split(',').includes(memento.owner)) ||
          (key == 'type' && val.split(',').includes(memento.type))
        ) {
          matches[i] = true
        }
      }
      if(matches.every(match => match == true)) {
        _addToMementoList(memento, opts._embed, result)
      }
		}
		else {
      _addToMementoList(memento, opts._embed, result)
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
		return result.slice(0, min(LIMIT, opts._limit) as i32)
	}
	return result.slice(0, LIMIT)
}

export function getMementoById(id: string): Memento | null {
	const result: Memento[] = []
  const mementoList = mementoCollection.get('list')
  if(!mementoList) {
    return null
  }
	for (let idx = 0; idx < mementoList.data.length; idx++) {
		const memento = mementoList.data[idx]
		if(memento.id == id) {
      _addToMementoList(memento, true, result)
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

export function updateMementoById(
  id: string, 
  name: string, 
  type: string, 
  desc: string, 
  descRaw: string
): Memento | null {
  let newMemento: Memento | null = null
  let idx = -1
  const mementoList = mementoCollection.get('list')
  if(mementoList) {
    for (let i = 0; i < mementoList.data.length; i++) {
      const user = mementoList.data[i]
      if(user.id == id) {
        newMemento = user
        idx = i
        break
      }
    }
    assert(
      !!newMemento,
      'Memento not found'
    )
  
    if(newMemento) {
      assert(
        newMemento.owner == context.sender,
        'Unable to update other user'
      )

      newMemento.name = name
      newMemento.type = type
      newMemento.desc = desc
      newMemento.descRaw = descRaw

      mementoList.data[idx] = newMemento
      mementoCollection.set('list', mementoList)
      return newMemento
    }
  }

  return null
}

export function deleteMementoById(id: string): Memento | null {
  let idx = -1
  const mementoList = mementoCollection.get('list')
  if(!mementoList) {
    return null
  }

  for (let i = 0; i < mementoList.data.length; i++) {
		const memento = mementoList.data[i]
		if(memento.id == id) {
      assert(
        memento.owner == context.sender,
        'Memento can only be deleted by memento owner'
      )
      idx = i
			break
		}
  }
  if(idx > -1) {
    const m = mementoList.data[idx]
    mementoList.data.splice(idx, 1)
    mementoCollection.set('list', mementoList)
    return m
  }
  return null
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
  p.createdAt = 123123123

  const list = postCollection.get('list')
  if(list) {
    list.data.push(p)
    postCollection.set('list', list)
  }
  else {
    const newList = new PostList()
    newList.data = [p]
    postCollection.set('list', newList)
  }
  return p
}

function _addToPostList(post: Post, embed: bool, result: Post[]): void {
  if(embed) {
    const user = getUserByUsername(post.owner)
    if(!!user) post.user = user

    const memento = getMementoById(post.mementoId)
    if(!!memento) post.memento = memento
  }
  result.push(post)
}

export function getPostList(
  query: string[] | null = null,
  opts: QueryOpts = {
    _embed: true,
    _sort: null,
    _order: null,
    _limit: 10
  }
): Post[] {
  const result: Post[] = []
  const postList = postCollection.get('list')
  if(!postList) {
    return []
  }
	for (let idx = 0; idx < postList.data.length; idx++) {
    const post = postList.data[idx]
		if(query) {
      const matches: bool[] = new Array<bool>(query.length)
      for (let i = 0; i < query.length; i++) {
        const splitted = query[i].split(':=')
        const key = splitted[0]
        const val = splitted[1]
        if(
          (key == 'status' && val.split(',').includes(post.status)) ||
          (key == 'originalId' && val.split(',').includes(post.originalId)) ||
          (key == 'owner' && val.split(',').includes(post.owner)) ||
          (key == 'mementoId' && val.split(',').includes(post.mementoId))
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
		return result.slice(0, min(LIMIT, opts._limit) as i32)
	}
	return result.slice(0, LIMIT)
}

export function getPostListByUserFollowing(
  username: string,
  query: string[] | null = null,
  opts: QueryOpts = {
    _embed: true,
    _sort: null,
    _order: null,
    _limit: 10
  }
): Post[] {
  const user = getUserByUsername(username)
  if(!user) {
    return []
  }
  const meFollowing = new Following(user.username, 'user')
  user.following.push(meFollowing)
  
  const result: Post[] = []
  const postList = postCollection.get('list')
  if(!postList) {
    return []
  }
	for (let idx = 0; idx < postList.data.length; idx++) {
    const post = postList.data[idx]
		if(query) {
      // add +1 to match the user following id
      const len = query.length + 1
      const matches: bool[] = new Array<bool>(len)
      for (let i = 0; i < user.following.length; i++) {
        if(
          (post.owner.indexOf(user.following[i].id) > -1) ||
          (post.mementoId.indexOf(user.following[i].id) > -1)
        ) {
          matches[i] = true
        }
      }
      for (let i = 0; i < query.length; i++) {
        const splitted = query[i].split(':=')
        const key = splitted[0]
        const val = splitted[1]
        if(
          (key == 'status' && val.split(',').includes(post.status))
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
		return result.slice(0, min(LIMIT, opts._limit) as i32)
	}
	return result.slice(0, LIMIT)
}

export function getPostById(id: string): Post | null {
  const result: Post[] = []
  const postList = postCollection.get('list')
  if(!postList) {
    return null
  }
	for (let idx = 0; idx < postList.data.length; idx++) {
		const post = postList.data[idx]
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
  const postList = postCollection.get('list')
  if(!postList) {
    return null
  }

  for (let i = 0; i < postList.data.length; i++) {
		const post = postList.data[i]
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
    const p = postList.data[idx]
    postList.data.splice(idx, 1)
    postCollection.set('list', postList)
    return p
  }
  return null
}

export function createUser(imgAvatar: Img, bio: string, bioRaw: string): User {
  const existUser = getUserByUsername(context.sender)
  assert(
    !existUser,
    'User already exist'
  )

  const newUser = new User()
  newUser.id = _genId()
  newUser.username = context.sender
  newUser.following = []
  newUser.imgAvatar = imgAvatar
  newUser.bio = bio
  newUser.bioRaw = bioRaw
  newUser.createdAt = 123123123

  const list = userCollection.get('list')
  if(list) {
    list.data.push(newUser)
    userCollection.set('list', list)
  }
  else {
    const newList = new UserList()
    newList.data = [newUser]
    userCollection.set('list', newList)
  }

	return newUser
}

function _addToUserList(user: User, embed: bool, result: User[]): void {
  if(embed) {}
  result.push(user)
}

/**
 * 
 * @param query possible query {id, username, username_like}
 * @param opts 
 */
export function getUserList(
  query: string[] | null = null,
  opts: QueryOpts = {
    _embed: true,
    _sort: null,
    _order: null,
    _limit: 10
}): User[] {
  const result: User[] = []
  const userList = userCollection.get('list')
  if(!userList) {
    return []
  }

  for (let idx = 0; idx < userList.data.length; idx++) {
    const user: User = userList.data[idx]
		if(query) {
      const matches: bool[] = new Array<bool>(query.length)
      for (let i = 0; i < query.length; i++) {
        // split key and val
        const splitted = query[i].split(':=')
        const key = splitted[0]
        const val = splitted[1]

        if(key == 'username_like') {
          const splittedVal = val.split(',')
          for (let j = 0; j < splittedVal.length; j++) {
            if(user.username.toLowerCase().indexOf(splittedVal[j].toLowerCase()) > -1) {
              matches[i] = true
            }
          }
        }
        if(
          (key == 'id' && val.split(',').includes(user.id)) ||
          (key == 'username' && val.split(',').includes(user.username))
        ) {
          matches[i] = true
        }
      }
      if(matches.every(match => match == true)) {
        _addToUserList(user, opts._embed, result)
      }
		}
		else {
      _addToUserList(user, opts._embed, result)
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
		return result.slice(0, min(LIMIT, opts._limit) as i32)
	}
	return result.slice(0, LIMIT)
}

export function getUserById(id: string): User | null {
  let result: User | null = null
  const userList = userCollection.get('list')
  if(!userList) {
    return null
  }
	for (let idx = 0; idx < userList.data.length; idx++) {
		const user = userList.data[idx]
		if(user.id == id) {
			result = user
			break
		}
	}
	if(result) {
		return result
	}
	else {
		return null
	}
}

export function getUserByUsername(username: string): User | null {
  let result: User | null = null
  const userList = userCollection.get('list')
  if(!userList) {
    return null
  }
	for (let idx = 0; idx < userList.data.length; idx++) {
		const user = userList.data[idx]
		if(user.username == username) {
			result = user
			break
		}
	}
	if(result) {
		return result
	}
	else {
		return null
	}
}

/**
 * 
 * @param id 
 * @param imgAvatar 
 * @param bio 
 * @param bioRaw 
 */
export function updateUserById(id: string, imgAvatar: Img, bio: string, bioRaw: string): User | null {
  let newUser: User | null = null
  let idx = -1
  const userList = userCollection.get('list')
  if(userList) {
    for (let i = 0; i < userList.data.length; i++) {
      const user = userList.data[i]
      if(user.id == id) {
        newUser = user
        idx = i
        break
      }
    }
    assert(
      !!newUser,
      'User not found'
    )
  
    if(newUser) {
      assert(
        newUser.username == context.sender,
        'Unable to update other user'
      )

      newUser.imgAvatar = imgAvatar
      newUser.bio = bio
      newUser.bioRaw = bioRaw

      userList.data[idx] = newUser
      userCollection.set('list', userList)
      return newUser
    }
  }

  return null
}

export function toggleUserFollow(id: string, targetId: string, targetType: string): User | null {
  let newUser: User | null = null
  let idx = -1
  const userList = userCollection.get('list')
  if(userList) {
    for (let i = 0; i < userList.data.length; i++) {
      const user = userList.data[i]
      if(user.id == id) {
        newUser = user
        idx = i
        break
      }
    }
    assert(
      !!newUser,
      'User not found'
    )
  
    if(newUser) {
      assert(
        newUser.username == context.sender,
        'Unable to update other user'
      )
      
      let followingIdx = -1
      for (let i = 0; i < newUser.following.length; i++) {
        const following = newUser.following[i]
        if(following.id == targetId && following.type == targetType) {
          followingIdx = i
          break
        }
      }
      if(followingIdx > -1) {
        newUser.following.splice(followingIdx, 1)
      }
      else {
        const newFollowing = new Following(targetId, targetType)
        newUser.following.push(newFollowing)
      }

      userList.data[idx] = newUser
      userCollection.set('list', userList)
      return newUser
    }
  }

  return null
}