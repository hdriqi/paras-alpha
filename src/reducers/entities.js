import { ENTITIES_ADD_POST, ENTITIES_UPDATE_POST, ENTITIES_DELETE_POST, ENTITIES_ADD_MEMENTO, ENTITIES_UPDATE_MEMENTO, ENTITIES_DELETE_MEMENTO } from '../actions/entities'

const initialState = {
  postById: {},
  mementoById: {}
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
      nextStateDeletePost[action.id].isDeleted = true
      return {
        ...state,
        postById: nextStateDeletePost
      }
    case ENTITIES_ADD_MEMENTO:
      const nextStateAddMemento = { ...state.mementoById }
      action.mementoList.forEach(m => {
        nextStateAddMemento[m.id] = m
      })
      return {
        ...state,
        mementoById: nextStateAddMemento
      }
    case ENTITIES_UPDATE_MEMENTO:
      const nextStateUpdateMemento = { ...state.mementoById }
      nextStateUpdateMemento[action.id] = action.memento
      return {
        ...state,
        mementoById: nextStateUpdateMemento
      }
    case ENTITIES_DELETE_MEMENTO:
      const nextStateDeleteMemento = { ...state.mementoById }
      nextStateDeleteMemento[action.id].isDeleted = true
      return {
        ...state,
        mementoById: nextStateDeleteMemento
      }
    default:
      return state
  }
}

export default reducer