import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import near from '../lib/near'

const PostScreen = ({ id, post = {}, mementoList = [], commentList = [] }) => {
  const [localPost, setLocalPost] = useState(post)
  const [localMementoList, setLocalMementoList] = useState(mementoList)
  const [localCommentList, setLocalCommentList] = useState(commentList)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const getData = async () => {
      try {
        const post = await near.contract.getPostById({
          id: id
        })
        
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