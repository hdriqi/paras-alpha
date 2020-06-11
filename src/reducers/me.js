import { ADD_MEMENTO_LIST, ADD_POST_LIST, SET_PROFILE, ADD_DATA, DELETE_POST, SET_USER, SET_FOLLOW, TOGGLE_FOLLOW } from '../actions/me'

const initialState = {
  mementoList: [

  ],
  postList: [

  ],
  user: null,
  profile: {},
  data: {},
  deletedPostList: [],
  followList: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_MEMENTO_LIST:
      return {
        ...state,
        mementoList: state.mementoList.concat(action.mementoList)
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
    case SET_FOLLOW:
      return {
        ...state,
        followList: action.followList
      }
    case TOGGLE_FOLLOW:
      const newList = [...state.followList]
      const idx = newList.indexOf(action.id)
      if (idx > -1) {
        newList.splice(idx, 1)
      }
      else {
        newList.push(action.id)
      }
      return {
        ...state,
        followList: newList
      }
    default:
      return state
  }
}

export default reducer