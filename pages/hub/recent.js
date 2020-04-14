import React, { useEffect, useState } from 'react'
import HubPage from '../../components/hubPage'
import NavMobile from '../../components/navMobile'
import Layout from '../../components/layout'

import axios from 'axios'
import { withRedux } from '../../lib/redux'
import { useSelector } from 'react-redux'

const HomePage = () => {
  const [me, setMe] = useState({})
  const [list, setList] = useState([])
  const profile = useSelector(state => state.me.profile)
  
  useEffect(() => {
    const getMe = async () => {
      const meRes = await axios.get(`http://localhost:3004/users/${profile.id}`)
      
      const userListRes = await axios.get(`http://localhost:3004/users`)
      const blockListRes = await axios.get(`http://localhost:3004/blocks`)

      const userList = userListRes.data.filter(user => user.id !== profile.id).map(user => {
        user.type = 'user'
        return user
      })
      const blockList = blockListRes.data.filter(block => block.userId !== profile.id).map(block => {
        block.type = 'block'
        return block
      })
      const list = userList.concat(blockList)
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

      setList(list)
      setMe(meRes.data)
    }
    if(profile.id) {
      getMe()
    }
  }, [profile])

  return (
    <Layout>
      <HubPage me={me} list={list} page={'recent'} />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

export default withRedux(HomePage)