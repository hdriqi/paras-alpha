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