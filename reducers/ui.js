import { TOGGLE_NEW_POST, TOGGLE_NEW_BLOCK } from '../actions/ui'

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
    default:
      return state
  }
}

export default reducer