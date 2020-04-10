import React, { useEffect } from 'react'
import NavMobile from '../components/navMobile'
import Layout from '../components/layout'
import Home from '../components/home'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addPostList } from '../actions/me'
import { withRedux } from '../lib/redux'

const HomePage = () => {
  const dispatch = useDispatch()
  const postList = useSelector(state => state.me.postList)

  useEffect(() => {
    const getData = async () => {
      const resPost = await axios.get('http://localhost:3004/posts?_sort=createdAt&_order=desc')
      const data = await Promise.all(resPost.data.map(post => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
          const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
          post.user = resUser.data
          post.block = resBlock.data
          resolve(post)
        })
      }))      
      dispatch(addPostList(data))
    }
    if(postList.length === 0) {
      getData()
    }
  }, [])

  return (
    <Layout>
      <Home postList={postList} />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

// export async function getServerSideProps() {
//   const response = await axios.get('http://localhost:3004/posts')

//   return { props: { postList: response.data } }
// }

export default withRedux(HomePage)