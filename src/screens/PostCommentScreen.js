import React, { useEffect, useState } from 'react'
import near from '../lib/near'
import PostComment from '../components/PostComment'

const PostCommentScreen = ({ id, post = {}, commentList = [] }) => {
  const [localPost, setLocalPost] = useState(post)
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

  useEffect(() => {
    const getData = async () => {
      const q = [`postId:=${localPost.id}`]
      const commentList = await near.contract.getCommentList({
        query: q,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'asc',
          _skip: 0,
          _limit: 10
        }
      })

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