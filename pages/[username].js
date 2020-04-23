import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/layout'
import NavMobile from '../components/navMobile'
import Profile from '../components/profile'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { withRedux } from '../lib/redux'

const UserPage = () => {
  const profile = useSelector(state => state.me.profile)

  const [user, setUser] = useState({})
  const [blockList, setBlockList] = useState([])
  const [postList, setPostList] = useState([])
  const router = useRouter()

  useEffect(() => {
    const getData = async () => {
      const respUser = await axios.get(`http://localhost:3004/users?username=${router.query.username}`)
      const user = respUser.data[0]

      const respBlock = await axios.get(`http://localhost:3004/blocks?userId=${user.id}`)
      const blockList = await Promise.all(respBlock.data.map(block => {
        return new Promise(async (resolve) => {
          const respPost = await axios.get(`http://localhost:3004/posts?blockId=${block.id}&_limit=3&_sort=createdAt&_order=desc`)
          block.postList = respPost.data
          resolve(block)
        })
      }))

      const respPost = await axios.get(`http://localhost:3004/posts?userId=${user.id}`)
      const feedPost = respPost.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const postList = await Promise.all(feedPost.map(post => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
          post.user = resUser.data

          if(post.blockId) {
            const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
            if(resBlock.status === 200) {
              post.block = resBlock.data
            }
          }
          resolve(post)
        })
      }))

      setUser(user)
      setBlockList(blockList)
      setPostList(postList)
    }
    if(router && router.query && router.query.username) {
      getData()
    }
  }, [router])

  return (
    <Layout>
      <div className="bg-white-1">
        <Profile me={profile} user={user} blockList={blockList} postList={postList} />
      </div>
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

export default withRedux(UserPage)