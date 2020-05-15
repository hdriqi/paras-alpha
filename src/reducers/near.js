import { INIT_NEAR } from '../actions/near'

const initialState = {
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_NEAR:
      return {
        ...state,
        contract: action.contract,
        currentUser: action.currentUser,
        nearConfig: action.nearConfig,
        wallet: action.wallet
      }
    default:
      return state
  }
}

export default reducer