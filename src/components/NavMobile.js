import { useDispatch, useSelector } from "react-redux"
import { setActivePage, toggleNewBlock } from "../actions/ui"
import { withRedux } from "../lib/redux"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Push from "./Push"

const NavLink = ({ name, href, as, activePage, children }) => {
  const router = useRouter()

  const _navigate = () => {
    if(router.asPath == as) {
      window.scroll({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
    }
    else {
      router.push(href, as)
    }
  }

  return (
    <span onClick={(e) => _navigate(e)}>
      <div className={`flex h-full items-center justify-center relative ${activePage === name ? `text-black-1` : `text-black-3`}`}>
        { children }
        {
          activePage === name && (
            <div className="absolute bottom-0 p-1">
              <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="2" cy="2" r="2" fill="#222222"/>
              </svg>
            </div>
          )
        }
      </div>
    </span>
  )
}

const NavMobile = () => {
  const showNewPost = useSelector(state => state.ui.showNewPost)
  const showNewBlock = useSelector(state => state.ui.showNewBlock)
  const activePage = useSelector(state => state.ui.activePage)
  const profile = useSelector(state => state.me.profile)
  const [showCreateNav, setShowCreateNav] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const _closeCreateNavOverlay = (e) => {
    if(e.target.id === 'create-nav-bg') {
      setShowCreateNav(false)
    }
  }

  useEffect(() => {
    setShowCreateNav(false)
  }, [router])

  const _showNewBlock = () => {
    setTimeout(() => {
      setShowCreateNav(false)
    }, 500)
    dispatch(toggleNewBlock(true))
  }


  useEffect(() => {
    switch(router.asPath) {
      case '/': 
        dispatch(setActivePage('feed'))  
        break
      case '/feed/recent': 
        dispatch(setActivePage('feed'))  
        break
      case '/hub/following': 
        dispatch(setActivePage('hub'))  
        break
      case '/hub/recent': 
        dispatch(setActivePage('hub'))  
        break
      case `/${profile.username}`: 
        dispatch(setActivePage('me'))  
        break
    }
  }, [profile, router])

  return (
    <div className={`${profile && profile.username ? 'visible' : 'invisible'} block md:hidden flex h-12 w-full bg-white`} style={{
      boxShadow: `0px -0.5px 0px rgba(0, 0, 0, 0.3)`
    }}>
      <div className="w-1/3">
        <NavLink name="feed" href="/" as="/" activePage={activePage} >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M5.88867 10L11.89 3.99867L17.8913 10H17.89V20H5.89001L5.89001 10H5.88867ZM3.89001 11.9987L2.4132 13.4755L1 12.0623L10.477 2.58529C11.2574 1.8049 12.5226 1.8049 13.303 2.58529L22.78 12.0623L21.3668 13.4755L19.89 11.9987V20C19.89 21.1046 18.9946 22 17.89 22H5.89001C4.78545 22 3.89001 21.1046 3.89001 20L3.89001 11.9987Z"/>
          </svg>
        </NavLink>
      </div>
      <div className="w-1/3 flex items-center justify-center">
        <svg onClick={e => setShowCreateNav(true)} width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="#222222"/>
          <path d="M17.4718 30V22.5282H10V17.4718H17.4718V10H22.5282V17.4718H30V22.5282H22.5282V30H17.4718Z" fill="white"/>
        </svg>
      </div>
      <div className="w-1/3">
        <NavLink name="me" href="/[username]" as={`/${profile.username}`} activePage={activePage} >
          <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="6.5" rx="4" ry="4.5" />
            <path d="M20 19C20 22.5 16 21.5 12 21.5C8 21.5 4 22.5 4 19C4 17 7.58172 14.5 12 14.5C16.4183 14.5 20 17 20 19Z" />
          </svg>
        </NavLink>
      </div>
      <div id="create-nav-bg" className="fixed inset-0 z-30 px-4" onClick={e => _closeCreateNavOverlay(e)} style={{
        backgroundColor: `rgba(0,0,0,0.5)`,
        visibility: `${showCreateNav ? `visible` : 'hidden'}`
      }}>
        <div className="text-center absolute bottom-0 left-0 right-0 bg-white" style={{
          transform: `translate3d(0,${showCreateNav ? `0%` : `100%`},0)`,
          transition: `all .2s`
        }}>
          <div className="flex">
            <div className="w-1/2">
            <Push href="/new/memento" as={`/new/memento`}>
              <div>
                <button className="w-full h-12 flex items-center justify-center text-center font-semibold text-black-1">
                <svg className="mr-2 fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 9H9V15H15V9ZM13.5 13.5H10.5V10.5H13.5V13.5Z" />
  <path d="M22.5 10.5V9H19.125V4.875H15V1.5H13.5V4.875H10.5V1.5H9V4.875H4.875V9H1.5V10.5H4.875V13.5H1.5V15H4.875V19.125H9V22.5H10.5V19.125H13.5V22.5H15V19.125H19.125V15H22.5V13.5H19.125V10.5H22.5ZM17.625 17.625H6.375V6.375H17.625V17.625Z" />
  </svg>
                  New Memento
                </button>
              </div>
            </Push>
            </div>
            <div className="w-1/2">
              <Push href="/new/post" as={`/new/post`}>
                <div>
                  <button className="w-full h-12 flex items-center justify-center text-center font-semibold text-black-1">
                  <svg className="mr-2 fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M22 20V13H20V20H4V4H11V2H4C2.89543 2 2 2.89543 2 4V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20ZM19.1781 2.72342C18.7197 2.26142 18.0921 2 17.4374 2C16.7834 2 16.1564 2.26083 15.6954 2.72463L7.3265 11.0934C6.57867 11.7523 6.08844 12.7328 6.00325 13.7873L6 17.0023V18.0023H10.1346C11.2689 17.9245 12.259 17.4295 12.9575 16.6238L21.279 8.30584C21.7407 7.84416 22.0001 7.21799 22.0001 6.56508C22.0001 5.91217 21.7407 5.286 21.279 4.82432L19.1781 2.72342ZM10.064 16.0048C10.5982 15.967 11.0955 15.7184 11.4948 15.2616L17.5567 9.19972L14.8024 6.44527L8.6961 12.5496C8.29095 12.9079 8.04031 13.4092 8 13.8678V16.0029L10.064 16.0048ZM16.2169 5.03128L18.9709 7.78551L19.8648 6.89162C19.9514 6.80502 20.0001 6.68756 20.0001 6.56508C20.0001 6.4426 19.9514 6.32514 19.8648 6.23854L17.7611 4.13486C17.6755 4.04855 17.5589 4 17.4374 4C17.3158 4 17.1992 4.04855 17.1136 4.13486L16.2169 5.03128Z"/>
    </svg>
                    New Post
                  </button>
                </div>
              </Push>
            </div>
          </div>
          <svg onClick={e => setShowCreateNav(false)} className="m-auto h-12 flex items-center" width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="#191F2C"/>
            <path d="M25.2833 28.8588L20 23.5755L14.7167 28.8588L11.1412 25.2833L16.4245 20L11.1412 14.7167L14.7167 11.1412L20 16.4245L25.2833 11.1412L28.8588 14.7167L23.5755 20L28.8588 25.2833L25.2833 28.8588Z" fill="white"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default withRedux(NavMobile)