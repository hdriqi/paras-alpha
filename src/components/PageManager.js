import { withRedux } from '../lib/redux'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, cloneElement, useState } from 'react'

import PostScreen from '../screens/PostScreen'
import HomeScreen from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import MementoScreen from '../screens/MementoScreen'
import MementoEditScreen from '../screens/MementoEditScreen'
import { useRouter } from 'next/router'
import { popPage } from '../actions/ui'
import ProfileEditScreen from '../screens/ProfileEditScreen'
import SearchScreen from '../screens/SearchScreen'
import NewPostScreen from '../screens/NewPostScreen'
import NewMementoScreen from '../screens/NewMementoScreen'
import Loading from './Loading'
import PostCommentScreen from '../screens/PostCommentScreen'
import PostMementoScreen from '../screens/PostMementoScreen'
import PostEditScreen from 'screens/PostEditScreen'
import FollowingScreen from 'screens/FollowingScreen'
import ProfileMementoScreen from 'screens/ProfileMementoScreen'
import WalletScreen from 'screens/WalletScreen'
import WalletTransactionScreen from 'screens/WalletTransactionScreen'
import NavMobile from './NavMobile'

const RootNavMobile = ({ router, pageList }) => {
  if (pageList.length === 0) {
    switch (router.pathname) {
      case '/':
      case '/explore':
      case '/wallet':
      case '/[id]':
        return (
          <div className="sticky bottom-0 right-0 left-0 z-20">
            <NavMobile />
          </div>
        )
      default:
        return null
    }
  }
  return null
}

const PageManager = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [rootEl, setRootEl] = useState(null)
  const pageList = useSelector(state => state.ui.pageList)
  const me = useSelector(state => state.me.profile)
  const [prevPageLen, setPrevPageLen] = useState(null)

  const screenList = {
    '/': HomeScreen,
    '/[id]': ProfileScreen,
    '/[id]/memento': ProfileMementoScreen,
    '/post/[id]': PostScreen,
    '/post/[id]/memento': PostMementoScreen,
    '/post/[id]/comment': PostCommentScreen,
    '/post/[id]/edit': PostEditScreen,
    '/me/edit': ProfileEditScreen,
    '/me/following': FollowingScreen,
    '/m/[id]': MementoScreen,
    '/m/[id]/edit': MementoEditScreen,
    '/hub/search': SearchScreen,
    '/new/post': NewPostScreen,
    '/new/memento': NewMementoScreen,
    '/wallet': WalletScreen,
    '/wallet/transaction': WalletTransactionScreen
  }

  useEffect(() => {
    // prevent re-render on root element when route navigating
    if (pageList.length === 0) {
      setRootEl(cloneElement(children))
    }
    // if back, then pop page
    if (pageList.length > 0 && pageList.length === prevPageLen) {
      setPrevPageLen(Math.max(0, pageList.length - 1))
      dispatch(popPage())
    }
    else {
      setPrevPageLen(pageList.length)
    }
  }, [router])

  return (
    <div className="bg-dark-0">
      <Loading />
      <div className={pageList.length === 0 ? 'block' : 'hidden'} id="page-root">
        {rootEl}
        <RootNavMobile router={router} pageList={pageList} />
      </div>
      {
        pageList.map((page, idx) => {
          const Page = page.component || screenList[page.href]
          if (!Page) {
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