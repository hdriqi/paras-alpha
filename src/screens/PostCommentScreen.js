import React, { useEffect, useState } from 'react'
import near from '../lib/near'
import PostComment from '../components/Post/Comment'
import axios from 'axios'

const PostCommentScreen = ({ id, post = {}, commentList = [] }) => {
  const [localPost, setLocalPost] = useState(post)
  const [localCommentList, setLocalCommentList] = useState(commentList)
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
      const response = await axios.get(`${process.env.BASE_URL}/comments?postId=${localPost
    .id}&_limit=100&_sort=asc`)
      const commentList = response.data.data

      setLocalCommentList(commentList)
    }
    if(localPost && localPost.id && localCommentList.length === 0) {
      console.log('get comment data')
      getData()
    }
  }, [localPost])

  return (
    <PostComment post={localPost} commentList={localCommentList} notFound={notFound} />
  )
}

export default PostCommentScreen