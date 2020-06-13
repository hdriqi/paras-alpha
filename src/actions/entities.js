export const ENTITIES_ADD_POST = 'ENTITIES_ADD_POST'
export const addPostList = (postList) => {
  return {
    type: ENTITIES_ADD_POST,
    postList: postList
  }
}

export const ENTITIES_UPDATE_POST = 'ENTITIES_UPDATE_POST'
export const updatePost = (id, post) => {
  return {
    type: ENTITIES_UPDATE_POST,
    id: id,
    post: post
  }
}

export const ENTITIES_DELETE_POST = 'ENTITIES_DELETE_POST'
export const deletePost = (id) => {
  return {
    type: ENTITIES_DELETE_POST,
    id: id
  }
}