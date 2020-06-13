import React, { useEffect } from 'react'
import Profile from '../components/Profile'
import { useDispatch, useSelector, batch } from 'react-redux'
import axios from 'axios'
import { addPostList } from 'actions/entities'
import { setUserPostListIds, setUserPageCount, setUserHasMore, initUser, setUserData } from 'actions/user'

const ProfileScreen = ({ id, fetch = false }) => {
  const dispatch = useDispatch()
  
  const postById = useSelector(state => state.entities.postById)
  const userData = useSelector(state => state.user[id]?.data)
  const postListIds = useSelector(state => state.user[id]?.postListIds)
  const pageCount = useSelector(state => state.user[id]?.pageCount)
  const hasMore = useSelector(state => state.user[id]?.hasMore)

  const getPost = async () => {
    const ITEM_LIMIT = 5
    const curList = postListIds ? [...postListIds] : []
    const page = pageCount || 0

    const response = await axios.get(`http://localhost:9090/posts?owner=${id}&_skip=${page * ITEM_LIMIT}&_limit=${ITEM_LIMIT}`)
    const newPostList = response.data.data
    const newPostListIds = newPostList.map(post => post.id)
    const latestPostListIds = curList.concat(newPostListIds)
    batch(() => {
      // add new post to entities
      dispatch(addPostList(newPostList))
      // set new post with new data
      dispatch(setUserPostListIds(id, latestPostListIds))
      dispatch(setUserPageCount(id, page + 1))
    })
    if(newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(setUserHasMore(id, false))
    }
  }

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`http://localhost:9090/users?id=${id}`)
      const user = response.data.data[0]
      dispatch(setUserData(id, user))
    }

    if(id && userData && !userData.id) {
      getData()
    }    
  }, [id, userData])

  useEffect(() => {
    if (id && pageCount === 0) {
      getPost()
    }
  }, [id, pageCount])

  useEffect(() => {
    if((id && !userData) | fetch) {
      dispatch(initUser(id))
    }
  }, [id])

  return (
    <Profile user={userData} hasMore={hasMore} getPost={getPost} postListIds={postListIds} postById={postById} />
  )
}

export default ProfileScreen