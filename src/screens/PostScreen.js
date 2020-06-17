import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addPostList } from 'actions/entities'

const PostScreen = ({ id }) => {
  const dispatch = useDispatch()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/posts?id=${id}`)
        const post = response.data.data[0]
        
        if(!post) {
          setNotFound(true)
        }
        dispatch(addPostList([post]))
      } catch (err) {
        console.log(err)
      }
    }
    if(id) {
      getData()
    }
  }, [id])

  return (
    <Post id={id} notFound={notFound} />
  )
}

export default PostScreen