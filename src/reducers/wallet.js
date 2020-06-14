import { SET_BALANCE, SET_WALLET_TX_LIST, SET_WALLET_HAS_MORE, SET_WALLET_PAGE_COUNT } from '../actions/wallet'

const initialState = {
  balance: 0,
  txList: [],
  hasMore: true,
  pageCount: 0
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_BALANCE:
      return {
        ...state,
        balance: action.balance
      }
    case SET_WALLET_TX_LIST:
      return {
        ...state,
        txList: action.txList
      }
    case SET_WALLET_HAS_MORE:
      return {
        ...state,
        hasMore: action.hasMore
      }
    case SET_WALLET_PAGE_COUNT:
      return {
        ...state,
        pageCount: action.pageCount
      }
    default:
      return state
  }
}

export default reducer