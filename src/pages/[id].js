import React from 'react'
import { useRouter } from 'next/router'
import NavMobile from '../components/NavMobile'
import { useSelector } from 'react-redux'
import { withRedux } from '../lib/redux'
import ProfileScreen from '../screens/ProfileScreen'

const UserPage = () => {
  const router = useRouter()
  const me = useSelector(state => state.me.profile)
  const user = useSelector(state => state.me.data[`${router.asPath}_user`])
  const mementoList = useSelector(state => state.me.data[`${router.asPath}_mementoList`])
  const postList = useSelector(state => state.me.data[`${router.asPath}_postList`])
  
  return (
    <div>
      <ProfileScreen id={router.query.id} user={router.query.id === me.id ? me : user} mementoList={mementoList} postList={postList} />
      <div className="sticky bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </div>
  )
}

export default withRedux(UserPage)