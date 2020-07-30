import { SET_HAS_MORE, SET_PAGE_COUNT, SET_POST_LIST_IDS, SET_PAGE_ACTIVE, SET_PAGE_SCROLL } from '../actions/home'

const initialState = {
  postListIds: null,
  hasMore: true,
  pageCount: 0,
  pageActive: 'editorsPick',
  pageScroll: {}
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_POST_LIST_IDS:
      return {
        ...state,
        postListIds: action.postListIds
      }
    case SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.hasMore
      }
    case SET_PAGE_COUNT:
      return {
        ...state,
        pageCount: action.pageCount
      }
    case SET_PAGE_ACTIVE:
      return {
        ...state,
        pageActive: action.pageActive
      }
    case SET_PAGE_SCROLL:
      return {
        ...state,
        pageScroll: action.pageScroll
      }
    default:
      return state
  }
}

export default reducer