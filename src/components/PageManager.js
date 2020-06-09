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

const PageManager = ({ children }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const pageList = useSelector(state => state.ui.pageList)
  const me = useSelector(state => state.me.profile)
  const [rootEl, setRootEl] = useState(null)
  const [prevPageLen, setPrevPageLen] = useState(null)

  const screenList = {
    '/': HomeScreen,
    '/[id]': ProfileScreen,
    '/post/[id]': PostScreen,
    '/post/[id]/memento': PostMementoScreen,
    '/post/[id]/comment': PostCommentScreen,
    '/me/edit': ProfileEditScreen,
    '/m/[id]': MementoScreen,
    '/m/[id]/edit': MementoEditScreen,
    '/hub/search': SearchScreen,
    '/new/post': NewPostScreen,
    '/new/memento': NewMementoScreen
  }

  useEffect(() => {
    if(router.asPath === '/' || router.asPath === `/${me.id}` || pageList.length === 0) {
      setRootEl(cloneElement(children))
    }
    // if back, then pop page
    if(pageList.length > 0 && pageList.length === prevPageLen) {
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
        { rootEl }
      </div>
      {
        pageList.map((page, idx) => {
          const Page = page.component || screenList[page.href]
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