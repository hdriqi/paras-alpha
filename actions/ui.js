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

export const TOGGLE_HUB_SEARCH = 'TOGGLE_HUB_SEARCH'
export const toggleHubSearch = (showHubSearch) => {
  return {
    type: TOGGLE_HUB_SEARCH,
    showHubSearch: showHubSearch
  }
}

export const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'
export const setActivePage = (activePage) => {
  return {
    type: SET_ACTIVE_PAGE,
    activePage: activePage
  }
}