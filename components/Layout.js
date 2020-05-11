import { Fragment, useEffect } from "react"
import Head from 'next/head'
import { setProfile, addBlockList } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from "react-redux"
import axios from "axios"

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.me.profile)

  useEffect(() => {
    const getData = async () => {
      const userId = window.localStorage.getItem('meId')
      const resUser = await axios.get(`http://localhost:3004/users/${userId}`)
      const respMementoList = await axios.get(`http://localhost:3004/blocks?userId=${userId}`)
      const mementoList = await Promise.all(respMementoList.data.map(memento => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${memento.userId}`)
          memento.user = resUser.data
          resolve(memento)
        })
      }))
      const me = resUser.data
      batch(() => {
        dispatch(setProfile(me))
        dispatch(addBlockList(mementoList))
      })
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
      <div className="max-w-sm m-auto mobile">
        { children }
      </div>
    </Fragment>
  )
}

export default withRedux(Layout)