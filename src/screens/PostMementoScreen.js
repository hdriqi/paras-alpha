import React, { useEffect, useState } from 'react'
import PostMemento from '../components/Post/Memento'
import axios from 'axios'

const PostScreen = ({ id, post = {}, mementoList = [] }) => {
  const [localPost, setLocalPost] = useState(post)
  const [localMementoList, setLocalMementoList] = useState(mementoList)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/posts?id=${id}`)
        const post = response.data.data[0]
        
        if(!post) {
          setNotFound(true)
        }
        setLocalPost(post)
      } catch (err) {
        console.log(err)
      }
    }
    if(localPost && !localPost.id && id) {
      console.log('get post data')
      getData()
    }
  }, [id, localPost])

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`${process.env.BASE_URL}/posts?originalId=${localPost
    .originalId}&__limit=100`)
      const similarPost = response.data.data
      const mementoList = similarPost.map(post => post.memento)
      setLocalMementoList(mementoList)
    }
    if(localPost && localPost.originalId && localMementoList.length === 0) {
      console.log('get memento list')
      getData()
    }
  }, [localPost])

  return (
    <PostMemento post={localPost} mementoList={localMementoList} notFound={notFound} />
  )
}

export default PostScreen