export const SET_BALANCE = 'SET_BALANCE'
export const setBalance = (balance) => {
  return {
    type: SET_BALANCE,
    balance: balance
  }
}

export const SET_WALLET_TX_LIST = 'SET_WALLET_TX_LIST'
export const setWalletTxList = (txList) => {
  return {
    type: SET_WALLET_TX_LIST,
    txList: txList
  }
}

export const SET_WALLET_HAS_MORE = 'SET_WALLET_HAS_MORE'
export const setWalletHasMore = (hasMore) => {
  return {
    type: SET_WALLET_HAS_MORE,
    hasMore: hasMore
  }
}

export const SET_WALLET_PAGE_COUNT = 'SET_WALLET_PAGE_COUNT'
export const setWalletPageCount = (pageCount) => {
  return {
    type: SET_WALLET_PAGE_COUNT,
    pageCount: pageCount
  }
}