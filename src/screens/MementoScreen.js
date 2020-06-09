import React, { useEffect, useState } from 'react'
import Memento from '../components/Memento'
import near from '../lib/near'
import { useSelector } from 'react-redux'
import axios from 'axios'

const MementoScreen = ({ id }) => {
  const me = useSelector(state => state.me.profile)
  const [localMemento, setLocalMemento] = useState({})
  const [localPostList, setLocalPostList] = useState([])
  const [localPendingPostCount, setLocalPendingPostCount] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [notFound, setNotFound] = useState(false)

  const getPost = async () => {
    try {
      const ITEM_COUNT = 5
      const response = await axios.get(`http://localhost:9090/posts?mementoId=${id}&_skip=${page * ITEM_COUNT}&_limit=${ITEM_COUNT}`)
      const postList = response.data.data || []

      const newList = [...localPostList].concat(postList)
      setLocalPostList(newList)
      setPage(page + 1)
      if(postList.length === 0 || postList.length < ITEM_COUNT) {
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
    if(id) {
      console.log('get memento data')
      getData()
    }
  }, [id])

  useEffect(() => {
    if(id) {
      console.log('get memento post list')
      getPost(0)
    }
  }, [id])

  useEffect(() => {
    const getData = async () => {
      const query = [`mementoId:=${localMemento.id}`, `status:=pending`]
      const response = await axios.get(`http://localhost:9090/posts?mementoId=${localMemento.id}`)
      const postList = response.data.data
      // const postList = await near.contract.getPostList({
      //   query: query,
      //   opts: {
      //     _embed: true,
      //     _sort: 'createdAt',
      //     _order: 'desc',
      //     _limit: 10
      //   }
      // })
      if(postList.length > 0) {
        if(postList.length > 9) {
          setLocalPendingPostCount('9+')
        }
        else {
          setLocalPendingPostCount(postList.length)
        }
      }
    }
    if(localMemento && localMemento.id && me.id === localMemento.owner) {
      console.log('get memento pending post list')
      getData()
    }
  }, [localMemento, me])

  return (
    <Memento memento={localMemento} postList={localPostList} getPost={getPost} page={page} hasMore={hasMore} pendingPostCount={localPendingPostCount} notFound={notFound} />
  )
}

export default MementoScreen