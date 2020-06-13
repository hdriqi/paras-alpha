import { INIT_USER, SET_USER_POST_LIST_IDS, SET_USER_HAS_MORE, SET_USER_PAGE_COUNT, SET_USER_DATA } from '../actions/user'

const initialState = {}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_USER:
      return {
        ...state,
        [action.userId]: {
          data: {},
          postListIds: [],
          pageCount: 0,
          hasMore: true
        }
      }
    case SET_USER_DATA:
      const newUser = { ...state[action.userId] }
      newUser.data = action.data
      return {
        ...state,
        [action.userId]: newUser
      }
    case SET_USER_POST_LIST_IDS:
      const newUserA = { ...state[action.userId] }
      newUserA.postListIds = action.postListIds
      return {
        ...state,
        [action.userId]: newUserA
      }
    case SET_USER_HAS_MORE:
      const newUserB = { ...state[action.userId] }
      newUserB.hasMore = action.hasMore
      return {
        ...state,
        [action.userId]: newUserB
      }
    case SET_USER_PAGE_COUNT:
      const newUserC = { ...state[action.userId] }
      newUserC.pageCount = action.pageCount
      return {
        ...state,
        [action.userId]: newUserC
      }
    default:
      return state
  }
}

export default reducer