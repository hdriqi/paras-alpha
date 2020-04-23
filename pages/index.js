import React, { useEffect } from 'react'
import NavMobile from '../components/navMobile'
import Layout from '../components/layout'
import Home from '../components/home'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addPostList, addData } from '../actions/me'
import { withRedux } from '../lib/redux'

const HomePage = () => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.me.profile)
  const postList = useSelector(state => state.me.data['/'])

  useEffect(() => {
    const getData = async () => {
      const resUser = await axios.get(`http://localhost:3004/users/${profile.id}`)
      const user = resUser.data
      const userFollowing = user.following.filter(following => following.type === 'user').map(following => following.id)
      userFollowing.push(profile.id)
      const blockFollowing = user.following.filter(following => following.type === 'block').map(following => following.id)
      const resPostAll = await axios.get(`http://localhost:3004/posts?_sort=createdAt&_order=desc`)
      const feedPost = resPostAll.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).filter(post => userFollowing.includes(post.userId) || blockFollowing.includes(post.blockId))
      const data = await Promise.all(feedPost.map(post => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
          post.user = resUser.data
          
          if(post.blockId) {
            const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
            post.block = resBlock.data
          }
          
          resolve(post)
        })
      }))
      dispatch(addData('/', data))
    }
    if(!postList && profile.id) {
      getData()
    }
  }, [profile])

  return (
    <Layout>
      <Home page={`feed`} postList={postList} />
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