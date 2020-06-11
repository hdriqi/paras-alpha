import React, { useEffect, useState } from 'react'
import PostEdit from '../components/NewPost/Edit'
import axios from 'axios'

const PostEditScreen = ({ id }) => {
  const [post, setPost] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`http://localhost:9090/posts?id=${id}`)
      setPost(response.data.data[0])
    }
    if (id) {
      getData()
    }
  }, [id])

  return post ? (
    <PostEdit post={post} />
  ) : (
    <div>
      Loading
    </div>
  )
}

export default PostEditScreen