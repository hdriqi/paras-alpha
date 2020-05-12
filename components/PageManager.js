import { withRedux } from '../lib/redux'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, cloneElement, useState } from 'react'

import PostScreen from '../screens/PostScreen'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import MementoScreen from '../screens/MementoScreen'
import MementoManageScreen from '../screens/MementoManageScreen'
import MementoEditScreen from '../screens/MementoEditScreen'
import MementoPendingScreen from '../screens/MementoPendingScreen'
import { useRouter } from 'next/router'
import { popPage } from '../actions/ui'
import ProfileEditScreen from '../screens/ProfileEditScreen'
import SearchScreen from '../screens/SearchScreen'

const PageManager = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const pageList = useSelector(state => state.ui.pageList)
  const me = useSelector(state => state.me.profile)
  const [rootEl, setRootEl] = useState(null)
  const [prevPageLen, setPrevPageLen] = useState(null)

  const screenList = {
    '/': HomeScreen,
    '/[username]': ProfileScreen,
    '/post/[id]': PostScreen,
    '/me/edit': ProfileEditScreen,
    '/m/[id]': MementoScreen,
    '/m/[id]/manage': MementoManageScreen,
    '/m/[id]/edit': MementoEditScreen,
    '/m/[id]/pending': MementoPendingScreen,
    '/hub/search': SearchScreen
  }

  useEffect(() => {
    if(router.asPath === '/' || router.asPath === `/${me.username}` || pageList.length === 0) {
      setRootEl(cloneElement(children))
    }
    // if back, then pop page
    if(pageList.length === prevPageLen) {
      setPrevPageLen(Math.max(0, pageList.length - 1))
      dispatch(popPage())
    }
    else {
      setPrevPageLen(pageList.length)
    }
  }, [router])

  return (
    <div>
      <div className={pageList.length === 0 ? 'block' : 'hidden'} id="page-root">
        { rootEl }
      </div>
      {
        pageList.map((page, idx) => {
          const Page = screenList[page.href]
          if(!Page) {
            throw Error('Page not registered')
          }
          return (
            <div key={idx} className={pageList.length === idx + 1 ? 'block' : 'hidden'} id={`page-${idx}`} style={{
              zIndex: 100 + idx
            }}>
              <Page {...page.props} />
            </div>
          )
        })
      }
    </div>
  )
}

export default withRedux(PageManager)