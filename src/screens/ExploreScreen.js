import Explore from "components/Explore"
import { useState, useEffect } from "react"
import axios from 'axios'
import { useDispatch, useSelector, batch } from "react-redux"
import { setExplorePostListIds, setExploreHasMore, setExplorePageCount } from "actions/explore"
import { addPostList } from "actions/entities"

const ExploreScreen = () => {
  const postListIds = useSelector(state => state.explore.postListIds)
  const hasMore = useSelector(state => state.explore.hasMore)
  const pageCount = useSelector(state => state.explore.pageCount)
  const dispatch = useDispatch()
  const [memoryGrant, setMemoryGrant] = useState(null)

  const getMemoryGrant = async () => {
    const response = await axios.get(`${process.env.BASE_URL}/grants?isActive=true`)
    const m = response.data.data[0]

    if (m) {
      setMemoryGrant(m)
    }
  }

  const getPost = async () => {
    const ITEM_LIMIT = 5
    const curList = postListIds ? [...postListIds] : []
    let page = pageCount || 0

    const response = await axios.get(`${process.env.BASE_URL}/posts?__skip=${page * 5}&__limit=${5}&__sort=-createdAt`)
    let newPostList = response.data.data
    const newPostListIds = newPostList.map(post => post.id)
    const latestPostListIds = curList.concat(newPostListIds)
    batch(() => {
      // add new post to entities
      dispatch(addPostList(newPostList))
      // set new post with new data
      dispatch(setExplorePostListIds(latestPostListIds))
      dispatch(setExplorePageCount(page + 1))
    })
    if (newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(setExploreHasMore(false))
    }
  }

  useEffect(() => {
    if(pageCount === 0) {
      getPost()
    }

    if (memoryGrant == null) {
      getMemoryGrant()
    }
  }, [])

  return (
    <Explore postListIds={postListIds} getPost={getPost} pageCount={pageCount} hasMore={hasMore} memoryGrant={memoryGrant} />
  )
}

export default ExploreScreen