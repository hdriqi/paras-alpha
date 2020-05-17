import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
import axios from 'axios'
import near from '../lib/near'

const PostScreen = ({ id, post = {}, mementoList = [], commentList = [] }) => {
  const [localPost, setLocalPost] = useState(post)
  const [localMementoList, setLocalMementoList] = useState(mementoList)
  const [localCommentList, setLocalCommentList] = useState(commentList)

  useEffect(() => {
    const getData = async () => {
      try {
        const post = await near.contract.getPostById({
          id: id
        })
        
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
    if(localPost.originalId && localMementoList.length === 0) {
      console.log('get memento list')
      getData()
    }
  }, [localPost])

  useEffect(() => {
    const getData = async () => {
      try {
        const resCommentList = await axios.get(`https://internal-db.dev.paras.id/comments?postId=${localPost.id}`)
        const commentList = await Promise.all(resCommentList.data.map(comment => {
          return new Promise(async (resolve) => {
            const resUser = await axios.get(`https://internal-db.dev.paras.id/users/${comment.userId}`)
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