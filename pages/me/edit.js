import React from 'react'
import Layout from '../../components/Layout'
import NavMobile from '../../components/NavMobile'
import ProfileEdit from '../../components/ProfileEdit'
import { useSelector } from 'react-redux'
import { withRedux } from '../../lib/redux'

const MeEdit = () => {
  const profile = useSelector(state => state.me.profile)

  return (
    <Layout>
      <ProfileEdit profile={profile} />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

export default withRedux(MeEdit)