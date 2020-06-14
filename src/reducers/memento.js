import { INIT_MEMENTO, SET_MEMENTO_POST_LIST_IDS, SET_MEMENTO_HAS_MORE, SET_MEMENTO_PAGE_COUNT, SET_MEMENTO_DATA } from '../actions/memento'

const initialState = {}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case INIT_MEMENTO:
      return {
        ...state,
        [action.mementoId]: {
          data: {},
          postListIds: [],
          pageCount: 0,
          hasMore: true
        }
      }
    case SET_MEMENTO_DATA:
      const newMemento = { ...state[action.mementoId] }
      newMemento.data = action.data
      return {
        ...state,
        [action.mementoId]: newMemento
      }
    case SET_MEMENTO_POST_LIST_IDS:
      const newMementoA = { ...state[action.mementoId] }
      newMementoA.postListIds = action.postListIds
      return {
        ...state,
        [action.mementoId]: newMementoA
      }
    case SET_MEMENTO_HAS_MORE:
      const newMementoB = { ...state[action.mementoId] }
      newMementoB.hasMore = action.hasMore
      return {
        ...state,
        [action.mementoId]: newMementoB
      }
    case SET_MEMENTO_PAGE_COUNT:
      const newMementoC = { ...state[action.mementoId] }
      newMementoC.pageCount = action.pageCount
      return {
        ...state,
        [action.mementoId]: newMementoC
      }
    default:
      return state
  }
}

export default reducer