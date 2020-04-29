import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import PostDetail from '../../components/postDetail'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { withRedux } from '../../lib/redux'
import { addPostList } from '../../actions/me'

const PostDetailPage = () => {
  const router = useRouter()

  const [id, setId] = useState(null)
  const [post, setPost] = useState({})
  const [commentList, setCommentList] = useState([])
  const [collectiveList, setCollectiveList] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const resPost = await axios.get(`http://localhost:3004/posts/${id}`)
        const post = resPost.data

        const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
        post.user = resUser.data

        const resCollectivePostList = await axios.get(`http://localhost:3004/posts?originalId=${post.originalId}`)
        const collectiveList = await Promise.all(resCollectivePostList.data.filter(post => post.blockId).map(post => {
          return new Promise(async (resolve) => {
            const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
            const block = resBlock.data
            const resUser = await axios.get(`http://localhost:3004/users/${block.userId}`)
            block.user = resUser.data
            resolve(block)
          })
        }))
        setCollectiveList(collectiveList)

        const resCommentList = await axios.get(`http://localhost:3004/comments?postId=${id}`)
        const commentList = await Promise.all(resCommentList.data.map(comment => {
          return new Promise(async (resolve) => {
            const resUser = await axios.get(`http://localhost:3004/users/${comment.userId}`)
            comment.user = resUser.data
            resolve(comment)
          })
        }))

        setPost(post)
        setCommentList(commentList)
      } catch (err) {
        console.log(err)
      }
    }
    if(id) {
      getData()
    }
  }, [id])

  useEffect(() => {
    if(router && router.query) {
      setId(router.query.id)
    }
  }, [router])

  return (
    <Layout>
      <PostDetail post={post} commentList={commentList} collectiveList={collectiveList} />
    </Layout>
  )
}

export default withRedux(PostDetailPage)