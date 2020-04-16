import { Fragment, useEffect } from "react"
import Head from 'next/head'
import { setProfile } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector } from "react-redux"
import axios from "axios"

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.me.profile)

  useEffect(() => {
    const getData = async () => {
      const userId = window.localStorage.getItem('meId')
      const resUser = await axios.get(`http://localhost:3004/users/${userId}`)
      const me = resUser.data
      dispatch(setProfile(me))
    }
    if(!profile.id) {
      getData()
    }
  }, [])
  
  return (
    <Fragment>
      <Head>
        <title>Paras</title>
      </Head>
      { children }
    </Fragment>
  )
}

export default withRedux(Layout)