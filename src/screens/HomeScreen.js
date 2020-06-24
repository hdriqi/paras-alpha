import { useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'

import Home from '../components/Home'
import { withRedux } from '../lib/redux'
import axios from 'axios'
import { setPageCount, setHasMore, setPostListIds } from 'actions/home'
import { addPostList } from 'actions/entities'
import ExploreScreen from './ExploreScreen'

const HomeScreen = ({  }) => {
  const dispatch = useDispatch()
  const me = useSelector(state => state.me.profile)
  const postListIds = useSelector(state => state.home.postListIds)
  const postById = useSelector(state => state.entities.postById)
  const hasMore = useSelector(state => state.home.hasMore)
  const pageCount = useSelector(state => state.home.pageCount)

  const getFeed = async () => {
    const ITEM_LIMIT = 5
    const curList = postListIds ? [...postListIds] : []
    let page = pageCount || 0 

    const response = await axios.get(`${process.env.BASE_URL}/feeds?__skip=${page * 5}&__limit=${5}&__sort=-createdAt`)
    let newPostList = response.data.data
    const newPostListIds = newPostList.map(post => post.id)
    const latestPostListIds = curList.concat(newPostListIds)
    batch(() => {
      // add new post to entities
      dispatch(addPostList(newPostList))
      // set new post with new data
      dispatch(setPostListIds(latestPostListIds))
      dispatch(setPageCount(page + 1))
    })
    if(newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(setHasMore(false))
    }
  }

  useEffect(() => {
    if(me.id && pageCount === 0) {
      getFeed(0)
    }
  }, [me])
  

  return me.id ? (
    <Home page={`feed`} postListIds={postListIds} postById={postById} getPost={getFeed} pageCount={pageCount} hasMore={hasMore} />
  ) : <ExploreScreen />
}

export default withRedux(HomeScreen)