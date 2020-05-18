import React, { useEffect, useState } from 'react'
import Memento from '../components/Memento'
import near from '../lib/near'
import { useSelector } from 'react-redux'

const MementoScreen = ({ id, memento = {}, postList = [] }) => {
  const me = useSelector(state => state.me.profile)
  const [localMemento, setLocalMemento] = useState(memento)
  const [localPostList, setLocalPostList] = useState(postList)
  const [localPendingPostCount, setLocalPendingPostCount] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [pageCount, setPageCount] = useState(0)
  const [notFound, setNotFound] = useState(false)

  const getPost = async (page) => {
    try {
      const curList = [...localPostList]
      const query = [`mementoId:=${localMemento.id}`, `status:=published`]
      const postList = await near.contract.getPostList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _skip: page * 10,
          _limit: 10
        }
      })

      const newList = curList.concat(postList)
      setLocalPostList(newList)
      setPageCount(page)
      if(postList.length === 0 || postList.length < 10) {
        setHasMore(false)
      }
    } catch (err) {
      console.log(err)
    }
  }
  
  useEffect(() => {
    const getData = async () => {
      try {
        const memento = await near.contract.getMementoById({
          id: id
        })
        
        if(!memento) {
          setNotFound(true)
        }
        setLocalMemento(memento)
      } catch (err) {
        console.log(err)
      }
    }
    if(id && !memento.id) {
      console.log('get memento data')
      getData()
    }
  }, [id])

  useEffect(() => {
    if(localMemento && localMemento.id) {
      console.log('get memento post list')
      getPost(0)
    }
  }, [localMemento])

  useEffect(() => {
    const getData = async () => {
      const query = [`mementoId:=${localMemento.id}`, `status:=pending`]
      const postList = await near.contract.getPostList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })
      if(postList.length > 0) {
        if(postList.length > 9) {
          setLocalPendingPostCount('9+')
        }
        else {
          setLocalPendingPostCount(postList.length)
        }
      }
    }
    if(localMemento && localMemento.id && me.username === localMemento.owner) {
      console.log('get memento pending post list')
      getData()
    }
  }, [localMemento, me])

  return (
    <Memento memento={localMemento} postList={localPostList} getPost={getPost} pageCount={pageCount} hasMore={hasMore} pendingPostCount={localPendingPostCount} notFound={notFound} />
  )
}

export default MementoScreen