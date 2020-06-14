import React, { useEffect } from 'react'
import Memento from '../components/Memento'
import axios from 'axios'
import { initMemento, setMementoPostListIds, setMementoPageCount, setMementoHasMore, setMementoData } from 'actions/memento'
import { addPostList } from 'actions/entities'
import { useDispatch, useSelector, batch } from 'react-redux'

const MementoScreen = ({ id, fetch = false }) => {
  const dispatch = useDispatch()
  
  const postById = useSelector(state => state.entities.postById)
  const mementoData = useSelector(state => state.memento[id]?.data)
  const postListIds = useSelector(state => state.memento[id]?.postListIds)
  const pageCount = useSelector(state => state.memento[id]?.pageCount)
  const hasMore = useSelector(state => state.memento[id]?.hasMore)

  const getPost = async () => {
    const ITEM_LIMIT = 5
    const curList = postListIds ? [...postListIds] : []
    const page = pageCount || 0

    const response = await axios.get(`http://localhost:9090/posts?mementoId=${id}&_skip=${page * ITEM_LIMIT}&_limit=${ITEM_LIMIT}`)
    const newPostList = response.data.data
    const newPostListIds = newPostList.map(post => post.id)
    const latestPostListIds = curList.concat(newPostListIds)
    batch(() => {
      // add new post to entities
      dispatch(addPostList(newPostList))
      // set new post with new data
      dispatch(setMementoPostListIds(id, latestPostListIds))
      dispatch(setMementoPageCount(id, page + 1))
    })
    if(newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(setMementoHasMore(id, false))
    }
  }

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`http://localhost:9090/mementos?id=${id}`)
      const memento = response.data.data[0]
      if (memento) {
        memento.isNotFound = false
      }
      else {
        memento.isNotFound = true
      }
      dispatch(setMementoData(id, memento))
    }

    if(id && mementoData && mementoData.isNotFound === undefined) {
      getData()
    }    
  }, [id, mementoData])

  useEffect(() => {
    if (id && pageCount === 0) {
      getPost()
    }
  }, [id, pageCount])

  useEffect(() => {
    if((id && !mementoData) | fetch) {
      dispatch(initMemento(id))
    }
  }, [id])

  return (
    <Memento memento={mementoData} postListIds={postListIds} postById={postById} getPost={getPost} hasMore={hasMore}  />
  )
}

export default MementoScreen