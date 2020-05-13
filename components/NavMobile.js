import { useDispatch, useSelector } from "react-redux"
import { setActivePage, toggleNewBlock } from "../actions/ui"
import { withRedux } from "../lib/redux"
import { useRouter } from "next/router"
import Link from 'next/link'
import { useEffect, useState } from "react"
import Push from "./Push"

const NavLink = ({ name, href, as, activePage, children }) => {
  return (
    <Link href={href} as={as}>
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
    </Link>
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
    <div className="flex h-12 w-full bg-white" style={{
      boxShadow: `0px -0.5px 0px rgba(0, 0, 0, 0.3)`
    }}>
      <div className="w-1/3">
        <NavLink name="feed" href="/" activePage={activePage} >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M5.88867 10L11.89 3.99867L17.8913 10H17.89V20H5.89001L5.89001 10H5.88867ZM3.89001 11.9987L2.4132 13.4755L1 12.0623L10.477 2.58529C11.2574 1.8049 12.5226 1.8049 13.303 2.58529L22.78 12.0623L21.3668 13.4755L19.89 11.9987V20C19.89 21.1046 18.9946 22 17.89 22H5.89001C4.78545 22 3.89001 21.1046 3.89001 20L3.89001 11.9987Z"/>
          </svg>
        </NavLink>
      </div>
      {/* <div className="w-1/3">
        <NavLink name="hub" href="/hub/recent" activePage={activePage} >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M14 8H10V6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10H8L8 14H6C3.79086 14 2 15.7909 2 18C2 20.2091 3.79086 22 6 22C8.20914 22 10 20.2091 10 18V16H14V18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14H16V10H18C20.2091 10 22 8.20914 22 6C22 3.79086 20.2091 2 18 2C15.7909 2 14 3.79086 14 6V8ZM10 14V10H14V14H10ZM16 16V18C16 19.1046 16.8954 20 18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16H16ZM6 16H8V18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16ZM16 8H18C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6V8ZM8 6V8H6C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z"/>
          </svg>
        </NavLink>
      </div> */}
      <div className="w-1/3 flex items-center justify-center">
        <svg onClick={e => setShowCreateNav(true)} width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d)">
          <circle cx="24" cy="24" r="20" fill="#222222"/>
          </g>
          <path d="M21.4718 34V26.5282H14V21.4718H21.4718V14H26.5282V21.4718H34V26.5282H26.5282V34H21.4718Z" fill="white"/>
          <defs>
          <filter id="filter0_d" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
          <feOffset/>
          <feGaussianBlur stdDeviation="2"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
          </filter>
          </defs>
        </svg>
      </div>
      {/* <div className="w-1/3">
        <NavLink name="message" href="/hub/following" activePage={activePage} >
          <svg className="fill-current" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 6.89287L7.72163 12.6841L8.40377 12.2748L7.99448 12.9569L13.7857 20.6786L20.6786 1.52588e-05L0 6.89287ZM7.84579 10.2772L4.25371 7.58315L17.5163 3.16229L13.0954 16.4249L10.4014 12.8328L14.2347 6.44385L7.84579 10.2772Z" fill="#616161"/>
          </svg>
        </NavLink>
      </div> */}
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
          <svg onClick={e => setShowCreateNav(false)} className="m-auto h-12 flex items-center" width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d)">
            <circle cx="24" cy="24" r="20" fill="#191F2C"/>
            <circle cx="24" cy="24" r="19.5" stroke="black"/>
            </g>
            <path d="M29.2833 32.8588L24 27.5755L18.7167 32.8588L15.1412 29.2833L20.4245 24L15.1412 18.7167L18.7167 15.1412L24 20.4245L29.2833 15.1412L32.8588 18.7167L27.5755 24L32.8588 29.2833L29.2833 32.8588Z" fill="white"/>
            <defs>
            <filter id="filter0_d" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
            </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default withRedux(NavMobile)