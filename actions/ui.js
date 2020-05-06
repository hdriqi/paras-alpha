export const TOGGLE_NEW_POST = 'TOGGLE_NEW_POST'
export const toggleNewPost = (showNewPost) => {
  return {
    type: TOGGLE_NEW_POST,
    showNewPost: showNewPost
  }
}

export const TOGGLE_NEW_BLOCK = 'TOGGLE_NEW_BLOCK'
export const toggleNewBlock = (showNewBlock) => {
  return {
    type: TOGGLE_NEW_BLOCK,
    showNewBlock: showNewBlock
  }
}

export const TOGGLE_MODAL_POST = 'TOGGLE_MODAL_POST'
export const toggleModalPost = (showModalPost, showModalPostData) => {
  return {
    type: TOGGLE_MODAL_POST,
    showModalPost: showModalPost,
    showModalPostData: showModalPostData
  }
}

export const TOGGLE_MODAL_MEMENTO = 'TOGGLE_MODAL_MEMENTO'
export const toggleModalMemento = (showModalMemento, showModalMementoData) => {
  return {
    type: TOGGLE_MODAL_MEMENTO,
    showModalMemento: showModalMemento,
    showModalMementoData: showModalMementoData
  }
}

export const TOGGLE_MODAL_COMMENT = 'TOGGLE_MODAL_COMMENT'
export const toggleModalComment = (showModalComment, showModalCommentData, showModalCommentCb) => {
  return {
    type: TOGGLE_MODAL_COMMENT,
    showModalComment: showModalComment,
    showModalCommentData: showModalCommentData,
    showModalCommentCb: showModalCommentCb
  }
}

export const TOGGLE_HUB_SEARCH = 'TOGGLE_HUB_SEARCH'
export const toggleHubSearch = (showHubSearch) => {
  return {
    type: TOGGLE_HUB_SEARCH,
    showHubSearch: showHubSearch
  }
}

export const TOGGLE_IMAGE_CROP = 'TOGGLE_IMAGE_CROP'
export const toggleImageCrop = (showImageCrop) => {
  return {
    type: TOGGLE_IMAGE_CROP,
    showImageCrop: showImageCrop
  }
}

export const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'
export const setActivePage = (activePage) => {
  return {
    type: SET_ACTIVE_PAGE,
    activePage: activePage
  }
}

export const PUSH_PAGE = 'PUSH_PAGE'
export const pushPage = (page) => {
  return {
    type: PUSH_PAGE,
    page: page  
  }
}

export const POP_PAGE = 'POP_PAGE'
export const popPage = () => {
  return {
    type: POP_PAGE
  }
}