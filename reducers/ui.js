import { TOGGLE_NEW_POST, TOGGLE_NEW_BLOCK, SET_ACTIVE_PAGE } from '../actions/ui'

const initialState = {
  showNewPost: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_NEW_POST:
      return {
        ...state,
        showNewPost: action.showNewPost
      }
    case TOGGLE_NEW_BLOCK:
      return {
        ...state,
        showNewBlock: action.showNewBlock
      }
    case SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.activePage
      }
    default:
      return state
  }
}

export default reducer