import { ADD_BLOCK_LIST, ADD_POST_LIST, SET_PROFILE } from '../actions/me'

const initialState = {
  blockList: [
    
  ],
  postList: [
    
  ],
  profile: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOCK_LIST:
      return {
        ...state,
        blockList: state.blockList.concat(action.blockList)
      }
    case ADD_POST_LIST:
      return {
        ...state,
        postList: state.postList.concat(action.postList)
      }
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      }
    default:
      return state
  }
}

export default reducer