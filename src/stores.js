import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

import ui from './reducers/ui'
import me from './reducers/me'
import near from './reducers/near'

const initialState = {}

const reducer = combineReducers({
  ui,
  me,
  near
})

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(logger))
  )
}