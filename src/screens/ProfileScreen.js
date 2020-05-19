import React, { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from 'react-redux'
import { addData } from '../actions/me'
import near from '../lib/near'

const ProfileScreen = ({ username }) => {
  const dispatch = useDispatch()

  // const [localUser, setLocalUser] = useState(user)
  // const [localMementoList, setLocalMementoList] = useState(mementoList)
  // const [localPostList, setLocalPostList] = useState(postList)

  const user = useSelector(state => state.me.data[`/${username}_user`])
  const mementoList = useSelector(state => state.me.data[`/${username}_mementoList`])
  const postList = useSelector(state => state.me.data[`/${username}_postList`])
  const pageCount = useSelector(state => state.me.data[`/${username}_pageCount`])
  const hasMore = useSelector(state => state.me.data[`/${username}_hasMore`])

  const getPost = async () => {
    const ITEM_LIMIT = 5
    const query = [`owner:=${username}`, 'status:=published']
    const curList = postList ? [...postList] : []
    const page = pageCount || 0

    const newPostList = await near.contract.getPostList({
      query: query,
      opts: {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _skip: page * ITEM_LIMIT,
        _limit: ITEM_LIMIT
      }
    })

    const newList = curList.concat(newPostList)
    dispatch(addData(`/${username}_postList`, postList))
    batch(() => {
      dispatch(addData(`/${username}_postList`, newList))
      dispatch(addData(`/${username}_pageCount`, page + 1))
    })
    if(page === 0) {
      dispatch(addData(`/${username}_hasMore`, true))
    }
    if(newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(addData(`/${username}_hasMore`, false))
    }
  }

  useEffect(() => {
    const getData = async () => {
      const user = await near.contract.getUserByUsername({
        username: username
      })
      // setLocalUser(user)
      dispatch(addData(`/${username}_user`, user))
    }

    if(username) {
      console.log('get user data')
      getData()
    }    
  }, [username])

  useEffect(() => {
    const getData = async () => {
      const query = [`owner:=${username}`]
      const mementoList = await near.contract.getMementoList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })
      const MementoWithPostList = await Promise.all(mementoList.map(memento => {
        return new Promise(async (resolve) => {
          const query = [`mementoId:=${memento.id}`, 'status:=published']
          const postList = await near.contract.getPostList({
            query: query,
            opts: {
              _embed: true,
              _sort: 'createdAt',
              _order: 'desc',
              _limit: 3
            }
          })
          memento.postList = postList
          resolve(memento)
        })
      }))

      // setLocalMementoList(MementoWithPostList)
      dispatch(addData(`/${username}_mementoList`, MementoWithPostList))
    }
    if(username && !mementoList) {
      console.log('get user memento list')
      getData()
    }
  }, [username])

  useEffect(() => {
    if(username && !postList) {
      console.log('get user post list')
      getPost()
    }
  }, [username])

  return (
    <Profile user={user} hasMore={hasMore} getPost={getPost} mementoList={mementoList} postList={postList} />
  )
}

export default withRedux(ProfileScreen)