export const SET_BALANCE = 'SET_BALANCE'
export const setBalance = (balance) => {
  return {
    type: SET_BALANCE,
    balance: balance
  }
}

export const SET_TX_LIST = 'SET_TX_LIST'
export const setTxList = (txList) => {
  return {
    type: SET_TX_LIST,
    txList: txList
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