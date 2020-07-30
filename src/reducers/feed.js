import { INIT_FEED, SET_FEED_POST_LIST_IDS, SET_FEED_HAS_MORE, SET_FEED_PAGE_COUNT, SET_FEED_DATA } from '../actions/feed'

const initialState = {}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_FEED:
      return {
        ...state,
        [action.feedId]: {
          data: {},
          postListIds: [],
          pageCount: 0,
          hasMore: true
        }
      }
    case SET_FEED_DATA:
      const newFeed = { ...state[action.feedId] }
      newFeed.data = action.data
      return {
        ...state,
        [action.feedId]: newFeed
      }
    case SET_FEED_POST_LIST_IDS:
      const newFeedA = { ...state[action.feedId] }
      newFeedA.postListIds = action.postListIds
      return {
        ...state,
        [action.feedId]: newFeedA
      }
    case SET_FEED_HAS_MORE:
      const newFeedB = { ...state[action.feedId] }
      newFeedB.hasMore = action.hasMore
      return {
        ...state,
        [action.feedId]: newFeedB
      }
    case SET_FEED_PAGE_COUNT:
      const newFeedC = { ...state[action.feedId] }
      newFeedC.pageCount = action.pageCount
      return {
        ...state,
        [action.feedId]: newFeedC
      }
    default:
      return state
  }
}

export default reducer