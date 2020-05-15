export const ADD_BLOCK_LIST = 'ADD_BLOCK'
export const addBlockList = (blockList) => {
  return {
    type: ADD_BLOCK_LIST,
    blockList: blockList
  }
}

export const ADD_POST_LIST = 'ADD_POST'
export const addPostList = (postList) => {
  return {
    type: ADD_POST_LIST,
    postList: postList
  }
}

export const SET_PROFILE = 'SET_PROFILE'
export const setProfile = (profile) => {
  return {
    type: SET_PROFILE,
    profile: profile
  }
}

export const SET_USER = 'SET_USER'
export const setUser = (user) => {
  return {
    type: SET_USER,
    user: user
  }
}

export const ADD_DATA = 'ADD_DATA'
export const addData = (path, data) => {
  return {
    type: ADD_DATA,
    path: path,
    data: data
  }
}

export const DELETE_POST = 'DELETE_POST'
export const deletePost = (id) => {
  return {
    type: DELETE_POST,
    id: id
  }
}