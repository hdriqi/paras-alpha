import React, { useEffect, useState } from 'react'
import Memento from '../components/Memento'
import axios from 'axios'

const MementoScreen = ({ id, memento = {}, postList = [] }) => {
  const [localMemento, setLocalMemento] = useState(memento)
  const [localPostList, setLocalPostList] = useState(postList)
  const [localPendingPostCount, setLocalPendingPostCount] = useState(null)
  
  useEffect(() => {
    const getData = async () => {
      try {
        const respMemento = await axios.get(`http://localhost:3004/blocks/${id}`)
        const memento = respMemento.data
        const respUser = await axios.get(`http://localhost:3004/users/${memento.userId}`)
        memento.user = respUser.data

        setLocalMemento(memento)
      } catch (err) {
        console.log(err)
      }
    }
    if(!localMemento.id && id) {
      console.log('get memento data')
      getData()
    }
  }, [id, localMemento])

  useEffect(() => {
    const getData = async () => {
      try {
        const respPostList = await axios.get(`http://localhost:3004/posts?blockId=${localMemento.id}&status=published&_sort=createdAt&_order=desc`)
        
        const postList = await Promise.all(respPostList.data.map(post => {
          return new Promise(async (resolve) => {
            if(localMemento.user && post.userId === localMemento.user.id) {
              post.user = localMemento.user
            }
            else {
              const respUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
              post.user = respUser.data
            }

            if(post.blockId === localMemento.id) {
              post.block = localMemento
            }
            else if(post.blockId) {
              const respMemento = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
              post.block = respMemento.data
            }
            resolve(post)
          })
        }))      

        setLocalPostList(postList)
      } catch (err) {
        console.log(err)
      }
    }
    if(localMemento.id && localPostList.length === 0) {
      console.log('get memento post list')
      getData()
    }
  }, [localMemento])

  useEffect(() => {
    const getData = async () => {
      const respPendingPostList = await axios.get(`http://localhost:3004/posts?blockId=${id}&status=pending&_sort=createdAt&_order=desc`)
      if(respPendingPostList.data.length > 0) {
        if(respPendingPostList.data.length > 99) {
          setLocalPendingPostCount('99+')
        }
        else {
          setLocalPendingPostCount(respPendingPostList.data.length)
        }
      }
    }
    getData()
  }, [])

  return (
    <Memento memento={localMemento} postList={localPostList} pendingPostCount={localPendingPostCount} />
  )
}

export default MementoScreen