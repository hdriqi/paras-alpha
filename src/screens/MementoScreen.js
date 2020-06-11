import React, { useEffect, useState } from 'react'
import Memento from '../components/Memento'
import axios from 'axios'

const MementoScreen = ({ id }) => {
  const [localMemento, setLocalMemento] = useState({})
  const [localPostList, setLocalPostList] = useState([])
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
        const response = await axios.get(`http://localhost:9090/mementos?id=${id}`)
        const memento = response.data.data[0]

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

  return (
    <Memento memento={localMemento} postList={localPostList} getPost={getPost} hasMore={hasMore} notFound={notFound} />
  )
}

export default MementoScreen