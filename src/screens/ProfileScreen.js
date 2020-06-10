import React, { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from 'react-redux'
import { addData } from '../actions/me'
import near from '../lib/near'
import axios from 'axios'

const ProfileScreen = ({ id }) => {
  const dispatch = useDispatch()

  // const [localUser, setLocalUser] = useState(user)
  // const [localMementoList, setLocalMementoList] = useState(mementoList)
  // const [localPostList, setLocalPostList] = useState(postList)

  const user = useSelector(state => state.me.data[`/${id}_user`])
  const mementoList = useSelector(state => state.me.data[`/${id}_mementoList`])
  const postList = useSelector(state => state.me.data[`/${id}_postList`])
  const pageCount = useSelector(state => state.me.data[`/${id}_pageCount`])
  const hasMore = useSelector(state => state.me.data[`/${id}_hasMore`])

  const getPost = async () => {
    const ITEM_LIMIT = 5
    const query = [`owner:=${id}`, 'status:=published']
    const curList = postList ? [...postList] : []
    const page = pageCount || 0

    const response = await axios.get(`http://localhost:9090/posts?owner=${id}&_skip=${page * ITEM_LIMIT}&_limit=${ITEM_LIMIT}`)
    const newPostList = response.data.data

    const newList = curList.concat(newPostList)
    dispatch(addData(`/${id}_postList`, postList))
    batch(() => {
      dispatch(addData(`/${id}_postList`, newList))
      dispatch(addData(`/${id}_pageCount`, page + 1))
    })
    if(page === 0) {
      dispatch(addData(`/${id}_hasMore`, true))
    }
    if(newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(addData(`/${id}_hasMore`, false))
    }
  }

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`http://localhost:9090/users?id=${id}`)
      const user = response.data.data[0]
      // const user = await near.contract.getUserByid({
      //   id: id
      // })
      // setLocalUser(user)
      dispatch(addData(`/${id}_user`, user))
    }

    if(id) {
      console.log('get user data')
      getData()
    }    
  }, [id])

  useEffect(() => {
    if(id && !postList) {
      console.log('get user post list')
      getPost()
    }
  }, [id])

  return (
    <Profile user={user} hasMore={hasMore} getPost={getPost} mementoList={mementoList} postList={postList} />
  )
}

export default withRedux(ProfileScreen)