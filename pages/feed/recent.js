import React, { useEffect, useState } from 'react'
import NavMobile from '../../components/navMobile'
import Layout from '../../components/layout'
import Home from '../../components/home'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addPostList } from '../../actions/me'
import { withRedux } from '../../lib/redux'

const FeedRecentPage = () => {
  // const profile = useSelector(state => state.me.profile)

  const [postList, setPostList] = useState([])

  useEffect(() => {
    const getData = async () => {
      const resPostAll = await axios.get(`http://localhost:3004/posts?_sort=createdAt&_order=desc`)
      const feedPost = resPostAll.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const data = await Promise.all(feedPost.map(post => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
          const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
          post.user = resUser.data
          post.block = resBlock.data
          resolve(post)
        })
      }))
      setPostList(data)
    }
    if(postList.length === 0) {
      getData()
    }
  }, [])

  return (
    <Layout>
      <Home page={`recent`} postList={postList} />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

export default withRedux(FeedRecentPage)