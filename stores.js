import { createStore, applyMiddleware, combineReducers } from 'redux'
import logger from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

import ui from './reducers/ui'

const initialState = {}

const reducer = combineReducers({
  ui
})

export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(logger))
  )
}