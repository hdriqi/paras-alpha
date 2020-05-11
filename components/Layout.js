import { Fragment, useEffect } from "react"
import Head from 'next/head'
import { setProfile, addBlockList } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from "react-redux"
import axios from "axios"

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.me.profile)
  const mementoList = useSelector(state => state.me.blockList)

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

  useEffect(() => {
    const getData = async () => {
      const respMementoList = await axios.get(`http://localhost:3004/blocks?userId=${profile.id}`)
      const mementoList = await Promise.all(respMementoList.data.map(memento => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${memento.userId}`)
          memento.user = resUser.data
          resolve(memento)
        })
      }))

      dispatch(addBlockList(mementoList))
    }
    if(profile.id && mementoList.length === 0) {
      getData()
    }
  }, [profile])
  
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