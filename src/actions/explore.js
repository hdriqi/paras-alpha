export const ADD_EXPLORE_POST = 'ADD_EXPLORE_POST'
export const addExplorePost = (post) => {
  return {
    type: ADD_EXPLORE_POST,
    post: post
  }
}