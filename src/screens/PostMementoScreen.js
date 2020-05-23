import React, { useEffect, useState } from 'react'
import near from '../lib/near'
import PostMemento from '../components/PostMemento'

const PostScreen = ({ id, post = {}, mementoList = [] }) => {
  const [localPost, setLocalPost] = useState(post)
  const [localMementoList, setLocalMementoList] = useState(mementoList)
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

  return (
    <PostMemento post={localPost} mementoList={localMementoList} notFound={notFound} />
  )
}

export default PostScreen