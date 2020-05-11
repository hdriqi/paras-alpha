import React, { useEffect, useState } from 'react'
import HubPage from '../../components/Hub'
import NavMobile from '../../components/NavMobile'
import Layout from '../../components/Layout'

import axios from 'axios'
import { withRedux } from '../../lib/redux'
import { useSelector, useDispatch } from 'react-redux'
import { addData } from '../../actions/me'

const HomePage = () => {
  const list = useSelector(state => state.me.data['/hub/following'])
  const profile = useSelector(state => state.me.profile)
  const dispatch = useDispatch()
  
  useEffect(() => {
    const getData = async () => {
      const user = profile
      if(Array.isArray(user.following)) {
        const following = await Promise.all(user.following.map(following => {
          return new Promise(async (resolve) => {
            if(following.type === 'user') {
              const resUser = await axios.get(`http://localhost:3004/users/${following.id}`)
              return resolve({
                ...resUser.data,
                ...{ type: 'user' }
              })
            }
            else {
              const resUser = await axios.get(`http://localhost:3004/blocks/${following.id}`)
              return resolve({
                ...resUser.data,
                ...{ type: 'block' }
              })
            }
          })
        }))
        dispatch(addData('/hub/following', following))
      }
    }
    if(!list && profile.id) {
      getData()
    }
  }, [profile])

  return (
    <Layout>
      <HubPage me={profile} list={list} page={'following'} />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

export default withRedux(HomePage)