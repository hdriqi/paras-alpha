import React from 'react'
import { useRouter } from 'next/router'
import { withRedux } from '../lib/redux'
import ProfileScreen from '../screens/ProfileScreen'

const UserPage = () => {
  const router = useRouter()
  
  return <ProfileScreen id={router.query.id} />
}

export default withRedux(UserPage)