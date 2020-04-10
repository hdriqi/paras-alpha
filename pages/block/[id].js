import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import BlockPage from '../../components/blockPage'
import { useRouter } from 'next/router'
import axios from 'axios'

const PostDetailPage = () => {
  const router = useRouter()

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
            const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
            const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
            post.user = resUser.data
            post.block = resBlock.data
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
      <BlockPage block={block} postList={postList} />
    </Layout>
  )
}

export default PostDetailPage