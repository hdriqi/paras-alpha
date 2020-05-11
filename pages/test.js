import React, { useEffect } from 'react'
import NavMobile from '../components/navMobile'
import Layout from '../components/layout'
import Home from '../components/home'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { addPostList, addData } from '../actions/me'
import { withRedux } from '../lib/redux'
import PageManager from '../components/PageManager'
import Profile from '../components/profile'
import { pushPage } from '../actions/ui'

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
      const resPostAll = await axios.get(`http://localhost:3004/posts?status=published&_sort=createdAt&_order=desc`)
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
      function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
      }

      const distinctData = removeDuplicates(data, 'originalId')
      dispatch(addData('/', distinctData))
    }
    if(!postList && profile.id) {
      getData()
    }
  }, [profile])

  return (
    <Layout>
      <PageManager>
        <div>
          <Home page={`feed`} postList={postList} />
          <div className="fixed bottom-0 right-0 left-0 z-20">
            <NavMobile />
          </div>
        </div>
      </PageManager>
    </Layout>
  )
}

export default withRedux(HomePage)