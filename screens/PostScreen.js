import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import axios from 'axios'

const PostScreen = ({ id, post = {}, mementoList = [], commentList = [] }) => {
  const [localPost, setLocalPost] = useState(post)
  const [localMementoList, setLocalMementoList] = useState(mementoList)
  const [localCommentList, setLocalCommentList] = useState(commentList)

  useEffect(() => {
    const getData = async () => {
      try {
        const resPost = await axios.get(`http://localhost:3004/posts/${id}`)
        const post = resPost.data

        if(post.blockId) {
          const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
          post.block = resBlock.data
        }

        const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
        post.user = resUser.data

        setLocalPost(post)
      } catch (err) {
        console.log(err)
      }
    }
    if(!localPost.id && id) {
      console.log('get post data')
      getData()
    }
  }, [id, localPost])

  useEffect(() => {
    const getData = async () => {
      const resPostMementoList = await axios.get(`http://localhost:3004/posts?originalId=${localPost.originalId}`)
      const mementoList = await Promise.all(resPostMementoList.data.filter(post => post.blockId).map(post => {
        return new Promise(async (resolve) => {
          const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
          const block = resBlock.data
          const resUser = await axios.get(`http://localhost:3004/users/${block.userId}`)
          block.user = resUser.data
          resolve(block)
        })
      }))
      setLocalMementoList(mementoList)
    }
    if(localPost.originalId && localMementoList.length === 0) {
      console.log('get memento list')
      getData()
    }
  }, [localPost])

  useEffect(() => {
    const getData = async () => {
      try {
        const resCommentList = await axios.get(`http://localhost:3004/comments?postId=${localPost.id}`)
        const commentList = await Promise.all(resCommentList.data.map(comment => {
          return new Promise(async (resolve) => {
            const resUser = await axios.get(`http://localhost:3004/users/${comment.userId}`)
            comment.user = resUser.data
            resolve(comment)
          })
        }))

        setLocalCommentList(commentList)
      } catch (err) {
        console.log(err)
      }
    }
    if(localPost.id && localCommentList.length === 0) {
      console.log('get comment data')
      getData()
    }
  }, [localPost])

  return (
    <Post post={localPost} commentList={localCommentList} mementoList={localMementoList} />
  )
}

export default PostScreen