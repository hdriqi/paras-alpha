import React, { useEffect, useState } from 'react'
import Profile from '../components/Profile'
import { withRedux } from '../lib/redux'
import { useDispatch } from 'react-redux'
import { addData } from '../actions/me'
import near from '../lib/near'

const ProfileScreen = ({ username, user = {}, mementoList, postList }) => {
  const dispatch = useDispatch()

  const [localUser, setLocalUser] = useState(user)
  const [localMementoList, setLocalMementoList] = useState(mementoList)
  const [localPostList, setLocalPostList] = useState(postList)

  useEffect(() => {
    const getData = async () => {
      const user = await near.contract.getUserByUsername({
        username: username
      })
      setLocalUser(user)
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

      setLocalMementoList(MementoWithPostList)
      dispatch(addData(`/${username}_mementoList`, MementoWithPostList))
    }
    if(username && !mementoList) {
      console.log('get user memento list')
      getData()
    }
  }, [username])

  useEffect(() => {
    const getData = async () => {
      const query = [`owner:=${username}`, 'status:=published']
      const postList = await near.contract.getPostList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })

      setLocalPostList(postList)
      dispatch(addData(`/${username}_postList`, postList))
    }
    if(username && !postList) {
      console.log('get user post list')
      getData()
    }
  }, [username])

  return (
    <Profile user={localUser} mementoList={localMementoList} postList={localPostList} />
  )
}

export default withRedux(ProfileScreen)