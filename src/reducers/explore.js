import { SET_EXPLORE_HAS_MORE, SET_EXPLORE_PAGE_COUNT, SET_EXPLORE_POST_LIST_IDS } from '../actions/explore'

const initialState = {
  postListIds: null,
  hasMore: true,
  pageCount: 0
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXPLORE_POST_LIST_IDS:
      return {
        ...state,
        postListIds: action.postListIds
      }
    case SET_EXPLORE_HAS_MORE:
      return {
        ...state,
        hasMore: action.hasMore
      }
    case SET_EXPLORE_PAGE_COUNT:
      return {
        ...state,
        pageCount: action.pageCount
      }
    default:
      return state
  }
}

export default reducer