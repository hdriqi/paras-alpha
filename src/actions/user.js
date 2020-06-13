export const INIT_USER = 'INIT_USER'
export const initUser = (userId) => {
  return {
    type: INIT_USER,
    userId: userId
  }
}

export const SET_USER_DATA = 'SET_USER_DATA'
export const setUserData = (userId, data) => {
  return {
    type: SET_USER_DATA,
    userId: userId,
    data: data
  }
}

export const SET_USER_POST_LIST_IDS = 'SET_POST_LIST_IDS'
export const setUserPostListIds = (userId, postListIds) => {
  return {
    type: SET_USER_POST_LIST_IDS,
    userId: userId,
    postListIds: postListIds
  }
}

export const SET_USER_HAS_MORE = 'SET_USER_HAS_MORE'
export const setUserHasMore = (userId, hasMore) => {
  return {
    type: SET_USER_HAS_MORE,
    userId: userId,
    hasMore: hasMore
  }
}

export const SET_USER_PAGE_COUNT = 'SET_USER_PAGE_COUNT'
export const setUserPageCount = (userId, pageCount) => {
  return {
    type: SET_USER_PAGE_COUNT,
    userId: userId,
    pageCount: pageCount
  }
}