import { ADD_EXPLORE_POST } from '../actions/explore'

const initialState = {
  postList: []
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_EXPLORE_POST: 
      return {
        ...state,
        postList: state.postList.concat([action.post])
      }
    default:
      return state
  }
}

export default reducer