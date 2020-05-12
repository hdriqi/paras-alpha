import React, { useEffect, useState } from 'react'
import NavMobile from '../../components/NavMobile'
import Layout from '../../components/Layout'
import Home from '../../components/Home'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addData } from '../../actions/me'
import { withRedux } from '../../lib/redux'

const FeedRecentPage = () => {
  const dispatch = useDispatch()
  const postList = useSelector(state => state.me.data['/feed/recent'])

  useEffect(() => {
    const getData = async () => {
      const resPostAll = await axios.get(`http://localhost:3004/posts?_sort=createdAt&_order=desc&status=published`)
      const data = await Promise.all(resPostAll.data.map(post => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
          if(post.blockId) {
            const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
            post.block = resBlock.data
          }
          post.user = resUser.data
          resolve(post)
        })
      }))
      dispatch(addData('/feed/recent', data))
    }
    if(!postList) {
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