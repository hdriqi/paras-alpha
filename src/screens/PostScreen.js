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

  useEffect(() => {
    const getData = async () => {
      const q = [`originalId:=${localPost.originalId}`]
      const similarPost = await near.contract.getPostList({
        query: q,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })
      const mementoList = similarPost.map(post => post.memento)
      setLocalMementoList(mementoList)
    }
    if(localPost && localPost.originalId && localMementoList.length === 0) {
      console.log('get memento list')
      getData()
    }
  }, [localPost])

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
    <Post post={localPost} commentList={localCommentList} mementoList={localMementoList} notFound={notFound} />
  )
}

export default PostScreen