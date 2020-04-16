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

export const SET_ACTIVE_PAGE = 'SET_ACTIVE_PAGE'
export const setActivePage = (activePage) => {
  return {
    type: SET_ACTIVE_PAGE,
    activePage: activePage
  }
}