export const INIT_MEMENTO = 'INIT_MEMENTO'
export const initMemento = (mementoId) => {
  return {
    type: INIT_MEMENTO,
    mementoId: mementoId
  }
}

export const SET_MEMENTO_DATA = 'SET_MEMENTO_DATA'
export const setMementoData = (mementoId, data) => {
  return {
    type: SET_MEMENTO_DATA,
    mementoId: mementoId,
    data: data
  }
}

export const SET_MEMENTO_POST_LIST_IDS = 'SET_MEMENTO_POST_LIST_IDS'
export const setMementoPostListIds = (mementoId, postListIds) => {
  return {
    type: SET_MEMENTO_POST_LIST_IDS,
    mementoId: mementoId,
    postListIds: postListIds
  }
}

export const SET_MEMENTO_HAS_MORE = 'SET_MEMENTO_HAS_MORE'
export const setMementoHasMore = (mementoId, hasMore) => {
  return {
    type: SET_MEMENTO_HAS_MORE,
    mementoId: mementoId,
    hasMore: hasMore
  }
}

export const SET_MEMENTO_PAGE_COUNT = 'SET_MEMENTO_PAGE_COUNT'
export const setMementoPageCount = (mementoId, pageCount) => {
  return {
    type: SET_MEMENTO_PAGE_COUNT,
    mementoId: mementoId,
    pageCount: pageCount
  }
}