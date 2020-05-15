import { ADD_BLOCK_LIST, ADD_POST_LIST, SET_PROFILE, ADD_DATA, DELETE_POST, SET_USER } from '../actions/me'

const initialState = {
  blockList: [
    
  ],
  postList: [
    
  ],
  user: null,
  profile: {},
  data: {},
  deletedPostList: []
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
    case SET_USER:
      return {
        ...state,
        user: action.user
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
    case DELETE_POST:
      return {
        ...state,
        deletedPostList: state.deletedPostList.concat(action.id)
      }      
    default:
      return state
  }
}

export default reducer