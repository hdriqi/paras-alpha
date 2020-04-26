import { TOGGLE_NEW_POST, TOGGLE_NEW_BLOCK, SET_ACTIVE_PAGE, TOGGLE_HUB_SEARCH, TOGGLE_MODAL_POST, TOGGLE_MODAL_MEMENTO, TOGGLE_IMAGE_CROP, TOGGLE_MODAL_COMMENT } from '../actions/ui'

const initialState = {
  showNewPost: false,
  showNewBlock: false,
  showHubSearch: false,
  showImageCrop: false,
  showModalPost: false,
  showModalPostData: {},
  showModalMemento: false,
  showModalMementoData: {},
  showModalComment: false,
  showModalCommentData: {},
  showModalCommentCb: null
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
    case TOGGLE_MODAL_POST:
      return {
        ...state,
        showModalPost: action.showModalPost,
        showModalPostData: action.showModalPostData
      }
    case TOGGLE_MODAL_MEMENTO:
      return {
        ...state,
        showModalMemento: action.showModalMemento,
        showModalMementoData: action.showModalMementoData
      }
    case TOGGLE_MODAL_COMMENT:
      return {
        ...state,
        showModalComment: action.showModalComment,
        showModalCommentData: action.showModalCommentData
      }
    case TOGGLE_HUB_SEARCH:
      return {
        ...state,
        showHubSearch: action.showHubSearch
      }
    case TOGGLE_IMAGE_CROP:
      return {
        ...state,
        showImageCrop: action.showImageCrop
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