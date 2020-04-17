import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import BlockPage from '../../components/blockPage'
import { useRouter } from 'next/router'
import axios from 'axios'
import { withRedux } from '../../lib/redux'
import { useSelector } from 'react-redux'

const PostDetailPage = () => {
  const router = useRouter()
  const profile = useSelector(state => state.me.profile)
  const [block, setBlock] = useState({})
  const [postList, setPostList] = useState([])
  
  useEffect(() => {
    const getData = async () => {
      try {
        const resBlock = await axios.get(`http://localhost:3004/blocks/${router.query.id}`)
        const block = resBlock.data
        const resUser = await axios.get(`http://localhost:3004/users/${block.userId}`)
        block.user = resUser.data
        
        const resPost = await axios.get(`http://localhost:3004/posts?blockId=${block.id}&_sort=createdAt&_order=desc`)
        const postList = await Promise.all(resPost.data.map(post => {
          return new Promise(async (resolve) => {
            if(post.userId === block.user.id) {
              post.user = block.user
            }
            else {
              const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
              post.user = resUser.data
            }

            if(post.blockId === block.id) {
              post.block = block
            }
            else {
              const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
              post.block = resBlock.data
            }
            resolve(post)
          })
        }))      

        setBlock(block)
        setPostList(postList)
      } catch (err) {
        console.log(err)
      }
    }
    if(router && router.query && router.query.id) {
      getData()
    }
  }, [router])

  return (
    <Layout>
      <BlockPage me={profile} block={block} postList={postList} />
    </Layout>
  )
}

export default withRedux(PostDetailPage)