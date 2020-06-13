export const SET_POST_LIST_IDS = 'SET_POST_LIST_IDS'
export const setPostListIds = (postListIds) => {
  return {
    type: SET_POST_LIST_IDS,
    postListIds: postListIds
  }
}

export const SET_HAS_MORE = 'SET_HAS_MORE'
export const setHasMore = (hasMore) => {
  return {
    type: SET_HAS_MORE,
    hasMore: hasMore
  }
}

export const SET_PAGE_COUNT = 'SET_PAGE_COUNT'
export const setPageCount = (pageCount) => {
  return {
    type: SET_PAGE_COUNT,
    pageCount: pageCount
  }
}