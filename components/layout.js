import { Fragment, useEffect } from "react"
import Head from 'next/head'
import { setProfile } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector } from "react-redux"

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.me.profile)

  useEffect(() => {
    if(!profile.id) {
      dispatch(setProfile({
        username: window.localStorage.getItem('meUsername'),
        id: window.localStorage.getItem('meId')
      }))
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