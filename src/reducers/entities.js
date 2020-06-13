import { ENTITIES_ADD_POST, ENTITIES_UPDATE_POST, ENTITIES_DELETE_POST } from '../actions/entities'

const initialState = {
  postById: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ENTITIES_ADD_POST:
      const nextStateAddPost = { ...state.postById }
      action.postList.forEach(post => {
        nextStateAddPost[post.id] = post
      })
      return {
        ...state,
        postById: nextStateAddPost
      }
    case ENTITIES_UPDATE_POST:
      const nextStateUpdatePost = { ...state.postById }
      nextStateUpdatePost[action.id] = action.post
      return {
        ...state,
        postById: nextStateUpdatePost
      }
    case ENTITIES_DELETE_POST:
      const nextStateDeletePost = { ...state.postById }
      delete nextStateDeletePost[action.id]
      return {
        ...state,
        postById: nextStateDeletePost
      }
    default:
      return state
  }
}

export default reducer