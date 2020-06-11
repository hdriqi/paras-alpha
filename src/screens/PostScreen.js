import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import axios from 'axios'

const PostScreen = ({ id, post = {} }) => {
  const [localPost, setLocalPost] = useState(post)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:9090/posts?id=${id}`)
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

  return (
    <Post post={localPost} notFound={notFound} />
  )
}

export default PostScreen