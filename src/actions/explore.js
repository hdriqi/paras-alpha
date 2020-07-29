export const SET_EXPLORE_POST_LIST_IDS = 'SET_EXPLORE_POST_LIST_IDS'
export const setExplorePostListIds = (postListIds) => {
  return {
    type: SET_EXPLORE_POST_LIST_IDS,
    postListIds: postListIds
  }
}

export const SET_EXPLORE_HAS_MORE = 'SET_EXPLORE_HAS_MORE'
export const setExploreHasMore = (hasMore) => {
  return {
    type: SET_EXPLORE_HAS_MORE,
    hasMore: hasMore
  }
}

export const SET_EXPLORE_PAGE_COUNT = 'SET_EXPLORE_PAGE_COUNT'
export const setExplorePageCount = (pageCount) => {
  return {
    type: SET_EXPLORE_PAGE_COUNT,
    pageCount: pageCount
  }
}