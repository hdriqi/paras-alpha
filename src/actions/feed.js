export const INIT_FEED = 'INIT_FEED'
export const initFeed = (feedId) => {
  return {
    type: INIT_FEED,
    feedId: feedId
  }
}

export const SET_FEED_DATA = 'SET_FEED_DATA'
export const setFeedData = (feedId, data) => {
  return {
    type: SET_FEED_DATA,
    feedId: feedId,
    data: data
  }
}

export const SET_FEED_POST_LIST_IDS = 'SET_FEED_POST_LIST_IDS'
export const setFeedPostListIds = (feedId, postListIds) => {
  return {
    type: SET_FEED_POST_LIST_IDS,
    feedId: feedId,
    postListIds: postListIds
  }
}

export const SET_FEED_HAS_MORE = 'SET_FEED_HAS_MORE'
export const setFeedHasMore = (feedId, hasMore) => {
  return {
    type: SET_FEED_HAS_MORE,
    feedId: feedId,
    hasMore: hasMore
  }
}

export const SET_FEED_PAGE_COUNT = 'SET_FEED_PAGE_COUNT'
export const setFeedPageCount = (feedId, pageCount) => {
  return {
    type: SET_FEED_PAGE_COUNT,
    feedId: feedId,
    pageCount: pageCount
  }
}