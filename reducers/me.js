import { ADD_BLOCK_LIST, ADD_POST_LIST, SET_PROFILE, ADD_DATA } from '../actions/me'

const initialState = {
  blockList: [
    
  ],
  postList: [
    
  ],
  profile: {},
  data: {}
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
    case ADD_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...{
            [action.path]: action.data
          }
        }
      }
    default:
      return state
  }
}

export default reducer