import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import NavMobile from '../components/navMobile'
import Profile from '../components/Profile'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { withRedux } from '../lib/redux'
import ProfileScreen from '../screens/ProfileScreen'

const UserPage = () => {
  const router = useRouter()
  const [username, setUsername] = useState(null)

  useEffect(() => {
    if(router && router.query && router.query.username) {
      setUsername(router.query.username)
    }
  }, [router])

  return (
    <ProfileScreen username={username} />
  )
}

export default withRedux(UserPage)