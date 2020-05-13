import React, { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import axios from 'axios'
import { withRedux } from '../lib/redux'
import { useDispatch } from 'react-redux'
import { addData } from '../actions/me'

const ProfileScreen = ({ username, user = {}, mementoList, postList }) => {
  const dispatch = useDispatch()

  const [localUser, setLocalUser] = useState(user)
  const [localMementoList, setLocalMementoList] = useState(mementoList)
  const [localPostList, setLocalPostList] = useState(postList)

  useEffect(() => {
    const getData = async () => {
      const respUser = await axios.get(`https://internal-db.dev.paras.id/users?username=${username}`)
      const user = respUser.data[0]

      setLocalUser(user)
      dispatch(addData(`/${username}_user`, user))
    }

    if(!localUser.id && username) {
      console.log('get user data')
      getData()
    }
  }, [localUser, username])

  useEffect(() => {
    const getData = async () => {
      const respMementoList = await axios.get(`https://internal-db.dev.paras.id/blocks?userId=${localUser.id}`)
      const mementoList = await Promise.all(respMementoList.data.map(block => {
        return new Promise(async (resolve) => {
          const respPost = await axios.get(`https://internal-db.dev.paras.id/posts?blockId=${block.id}&status=published&_limit=3&_sort=createdAt&_order=desc`)
          block.user = localUser
          block.postList = respPost.data
          resolve(block)
        })
      }))

      setLocalMementoList(mementoList)
      dispatch(addData(`/${username}_mementoList`, mementoList))
    }
    if(localUser.id && !mementoList) {
      console.log('get user memento list')
      getData()
    }
  }, [localUser])

  useEffect(() => {
    const getData = async () => {
      const respPost = await axios.get(`https://internal-db.dev.paras.id/posts?userId=${localUser.id}&status=published&_sort=createdAt&_order=desc`)
      const postList = await Promise.all(respPost.data.map(post => {
        return new Promise(async (resolve) => {
          if(post.userId === localUser.id) {
            post.user = localUser
          }
          else {
            const resUser = await axios.get(`https://internal-db.dev.paras.id/users/${post.userId}`)
            post.user = resUser.data
          }

          if(post.blockId) {
            const resBlock = await axios.get(`https://internal-db.dev.paras.id/blocks/${post.blockId}`)
            if(resBlock.status === 200) {
              post.block = resBlock.data
            }
          }
          resolve(post)
        })
      }))

      setLocalPostList(postList)
      dispatch(addData(`/${username}_postList`, postList))
    }
    if(localUser.id && !postList) {
      console.log('get user post list')
      getData()
    }
  }, [localUser])

  return (
    <Profile user={localUser} mementoList={localMementoList} postList={localPostList} />
  )
}

export default withRedux(ProfileScreen)