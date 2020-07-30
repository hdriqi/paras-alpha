import React, { useEffect } from 'react'
import Home from '../components/Home'
import axios from 'axios'
import { initFeed, setFeedPostListIds, setFeedPageCount, setFeedHasMore } from 'actions/feed'
import { addPostList } from 'actions/entities'
import { useDispatch, useSelector, batch } from 'react-redux'

const FeedScreen = ({ id }) => {
  const dispatch = useDispatch()

  const feedData = useSelector(state => state.feed[id]?.data)
  const postListIds = useSelector(state => state.feed[id]?.postListIds)
  const pageCount = useSelector(state => state.feed[id]?.pageCount)
  const hasMore = useSelector(state => state.feed[id]?.hasMore)

  const getPost = async () => {
    const ITEM_LIMIT = 5
    const curList = postListIds ? [...postListIds] : []
    const page = pageCount || 0

    const response = await axios.get(`${process.env.BASE_URL}/timelines?feedId=${id}&__skip=${page * ITEM_LIMIT}&__limit=${ITEM_LIMIT}&__sort=-createdAt`)
    const newTimelinePostList = response.data.data
    const newPostList = newTimelinePostList.map(post => post.post)
    const newPostListIds = newPostList.map(post => post.id)
    const latestPostListIds = curList.concat(newPostListIds)
    batch(() => {
      // add new post to entities
      dispatch(addPostList(newPostList))
      // set new post with new data
      dispatch(setFeedPostListIds(id, latestPostListIds))
      dispatch(setFeedPageCount(id, page + 1))
    })
    if(newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(setFeedHasMore(id, false))
    }
  }

  useEffect(() => {
    if (pageCount === 0) {
      getPost()
    }
  }, [id, pageCount])

  useEffect(() => {
    if (id && !feedData) {
      dispatch(initFeed(id))
    }
  }, [id])

  return (
    <Home postListIds={postListIds} getPost={getPost} hasMore={hasMore}  />
  )
}

export default FeedScreen