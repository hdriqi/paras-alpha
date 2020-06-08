import { useDispatch, useSelector } from "react-redux"
import { setActivePage, toggleNewBlock } from "../actions/ui"
import { withRedux } from "../lib/redux"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Push from "./Push"

const NavLink = ({ name, href, as, activePage, children }) => {
  const router = useRouter()

  const _navigate = () => {
    if (router.asPath == as) {
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
      <a className={`flex h-full items-center  relative ${activePage === name ? `text-white` : `text-white-3`}`}>
        {children}
      </a>
    </span>
  )
}

const NavMobile = () => {
  const activePage = useSelector(state => state.ui.activePage)
  const profile = useSelector(state => state.me.profile)
  const [showCreateNav, setShowCreateNav] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  const _closeCreateNavOverlay = (e) => {
    if (e.target.id === 'create-nav-bg') {
      setShowCreateNav(false)
    }
  }

  useEffect(() => {
    setShowCreateNav(false)
  }, [router])

  useEffect(() => {
    switch (router.asPath) {
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
    <div className={`${profile && profile.id ? 'visible' : 'invisible'} sticky min-h-screen top-0 flex flex-col w-full`} style={{
      boxShadow: `0px -0.5px 0px rgba(0, 0, 0, 0.3)`
    }}>
      <div className="h-12 flex items-center bg-dark-12">
        <div className="ml-auto w-full" style={{
          maxWidth: `10rem`
        }}>
          <NavLink name="feed" href="/" as="/" activePage={activePage} >
            <svg width="48" height="30" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M2.5 36H5.7757L4.94237 29.4107C8.4338 29.9286 15.8333 30.1393 17.5 26.8393C19.1667 30.1393 26.5662 29.9286 30.0576 29.4107L29.2243 36H32.5L35 12L25.8597 14.5714C22.7954 15.3571 17.5 17.85 17.5 21.5357C17.5 17.85 12.2046 15.3571 9.14025 14.5714L0 12L2.5 36ZM4.58327 15.1558C7.9166 16.013 15.0719 19.0987 16.7386 24.5844C14.9681 27.3159 11.3626 27.2265 9.12971 27.1699C8.84016 27.1626 8.57248 27.1558 8.33335 27.1558C3.75001 27.1558 4.39698 15.8949 4.58327 15.1558ZM30.4167 15.1558C27.0834 16.013 19.9281 19.0987 18.2614 24.5844C20.0319 27.3159 23.6374 27.2265 25.8703 27.1699C26.1599 27.1626 26.4275 27.1558 26.6667 27.1558C31.25 27.1558 30.603 15.8949 30.4167 15.1558Z" fill="white" />
              <path d="M25.0488 1.46341V9.02439H18V1.45122L25.0488 1.46341ZM24.3049 8.12195L22.1341 2.62195H19.5732V3.42683H20.9634L19.0976 8.09756L19.8415 8.40244L20.4756 6.79268H22.9146L23.5732 8.41463L24.3049 8.12195ZM22.6098 6H20.7927L21.7073 3.71951L22.6098 6Z" fill="white" />
              <path d="M32.8773 8.40244L26.4505 9.43902L25.1334 1.26829L31.5724 0.231707L32.8773 8.40244ZM31.4017 7.35366L31.2675 6.51219L28.6212 6.93902L27.8651 2.2561L26.4627 2.4878L26.5968 3.31707L27.17 3.21951L27.9261 7.90244L31.4017 7.35366Z" fill="white" />
              <path d="M35.3932 7.19512C35.6452 7.19512 35.8973 7.17886 36.1493 7.14634C36.4013 7.10569 36.629 7.03252 36.8322 6.92683C37.0355 6.81301 37.2021 6.65854 37.3322 6.46341C37.4623 6.26016 37.5273 5.99187 37.5273 5.65854C37.5273 5.31707 37.4379 5.04878 37.259 4.85366C37.0802 4.65041 36.8525 4.49593 36.5761 4.39024C36.2997 4.28455 35.9908 4.21951 35.6493 4.19512C35.3078 4.1626 34.9786 4.14634 34.6615 4.14634C34.4908 4.14634 34.3241 4.15041 34.1615 4.15854C34.007 4.15854 33.8647 4.15854 33.7347 4.15854L33.7103 4.90244L34.1127 4.92683L34.0273 9.14634H34.7712L34.8322 7.18293C34.9298 7.19106 35.0233 7.19512 35.1127 7.19512C35.2103 7.19512 35.3038 7.19512 35.3932 7.19512ZM36.7712 5.67073C36.7712 5.84146 36.7347 5.97967 36.6615 6.08537C36.5964 6.18293 36.503 6.26016 36.381 6.31707C36.2672 6.37398 36.1371 6.41463 35.9908 6.43902C35.8444 6.45528 35.694 6.46341 35.5395 6.46341C35.442 6.46341 35.3363 6.46341 35.2225 6.46341C35.1086 6.45528 34.9826 6.44715 34.8444 6.43902L34.881 4.91463C35.5314 4.91463 36.007 4.95935 36.3078 5.04878C36.6168 5.13008 36.7712 5.3374 36.7712 5.67073ZM38.3322 10L32.7469 9.89024L32.881 3.58537L38.4664 3.70732L38.3322 10Z" fill="white" />
              <path d="M44.2445 3.91463L43.9274 9.73171L38.9274 9.47561L39.2323 3.64634L44.2445 3.91463ZM43.3298 4.7439L42.7567 4.71951L42.6957 6.18293L41.0737 6.09756L41.1469 4.63415L40.1835 4.59756L40.1347 5.15854L40.5494 5.17073L40.3786 8.26829L40.9396 8.31707L41.025 6.65854L42.6469 6.7439L42.5615 8.40244L43.1347 8.42683L43.3298 4.7439Z" fill="white" />
              <path d="M51.3541 0.707317L50.598 7.46341L44.2932 6.76829L45.0493 0L51.3541 0.707317ZM50.0127 6.58537L48.6346 1.46341L46.3419 1.19512L46.2688 1.91463L47.5005 2.06098L45.3663 6.03658L46.0005 6.39024L46.7322 5.02439L48.9029 5.2561L49.3297 6.78049L50.0127 6.58537ZM48.72 4.52439L47.0858 4.34146L48.1468 2.39024L48.72 4.52439Z" fill="white" />
            </svg>
          </NavLink>
        </div>
      </div>
      <div className="ml-auto w-full" style={{
        maxWidth: `10rem`
      }}>
        <NavLink name="feed" href="/" as="/" activePage={"feed"} >
          <div className="flex items-center mt-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M5.88867 10L11.89 3.99867L17.8913 10H17.89V20H5.89001L5.89001 10H5.88867ZM3.89001 11.9987L2.4132 13.4755L1 12.0623L10.477 2.58529C11.2574 1.8049 12.5226 1.8049 13.303 2.58529L22.78 12.0623L21.3668 13.4755L19.89 11.9987V20C19.89 21.1046 18.9946 22 17.89 22H5.89001C4.78545 22 3.89001 21.1046 3.89001 20L3.89001 11.9987Z" />
            </svg>
            <div className="ml-4">
              <h3 className="font-bold text-xl">Home</h3>
            </div>
          </div>
        </NavLink>
        <NavLink name="me" href="/[username]" as={`/${profile.username}`} activePage={activePage} >
          <div className="flex items-center mt-4">
            <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="12" cy="6.5" rx="4" ry="4.5" />
              <path d="M20 19C20 22.5 16 21.5 12 21.5C8 21.5 4 22.5 4 19C4 17 7.58172 14.5 12 14.5C16.4183 14.5 20 17 20 19Z" />
            </svg>
          </div>
        </NavLink>
        <div>
          <Push href="/new/post" as="/new/post">
            <button className="text-primary-5">New Post</button>
          </Push>
        </div>
      </div>
      <div className="w-full mt-6">

      </div>
      <div id="create-nav-bg" className="fixed inset-0 z-30 px-4" onClick={e => _closeCreateNavOverlay(e)} style={{
        backgroundColor: `rgba(0,0,0,0.5)`,
        visibility: `${showCreateNav ? `visible` : 'hidden'}`
      }}>
        <div className="text-center absolute bottom-0 left-0 right-0 bg-dark-0" style={{
          transform: `translate3d(0,${showCreateNav ? `0%` : `100%`},0)`,
          transition: `all .2s`
        }}>
          <div className="flex">
            <div className="w-1/2">
              <Push href="/new/memento" as={`/new/memento`}>
                <div>
                  <button className="w-full h-12 flex items-center  text-center font-semibold text-black-1">
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
                  <button className="w-full h-12 flex items-center  text-center font-semibold text-black-1">
                    <svg className="mr-2 fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M22 20V13H20V20H4V4H11V2H4C2.89543 2 2 2.89543 2 4V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20ZM19.1781 2.72342C18.7197 2.26142 18.0921 2 17.4374 2C16.7834 2 16.1564 2.26083 15.6954 2.72463L7.3265 11.0934C6.57867 11.7523 6.08844 12.7328 6.00325 13.7873L6 17.0023V18.0023H10.1346C11.2689 17.9245 12.259 17.4295 12.9575 16.6238L21.279 8.30584C21.7407 7.84416 22.0001 7.21799 22.0001 6.56508C22.0001 5.91217 21.7407 5.286 21.279 4.82432L19.1781 2.72342ZM10.064 16.0048C10.5982 15.967 11.0955 15.7184 11.4948 15.2616L17.5567 9.19972L14.8024 6.44527L8.6961 12.5496C8.29095 12.9079 8.04031 13.4092 8 13.8678V16.0029L10.064 16.0048ZM16.2169 5.03128L18.9709 7.78551L19.8648 6.89162C19.9514 6.80502 20.0001 6.68756 20.0001 6.56508C20.0001 6.4426 19.9514 6.32514 19.8648 6.23854L17.7611 4.13486C17.6755 4.04855 17.5589 4 17.4374 4C17.3158 4 17.1992 4.04855 17.1136 4.13486L16.2169 5.03128Z" />
                    </svg>
                    New Post
                  </button>
                </div>
              </Push>
            </div>
          </div>
          <svg onClick={e => setShowCreateNav(false)} className="m-auto h-12 flex items-center" width="36" height="36" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_d)">
              <circle cx="24" cy="24" r="20" fill="white" />
              <circle cx="24" cy="24" r="19.5" stroke="black" />
            </g>
            <path d="M29.2833 32.8588L24 27.5755L18.7167 32.8588L15.1412 29.2833L20.4245 24L15.1412 18.7167L18.7167 15.1412L24 20.4245L29.2833 15.1412L32.8588 18.7167L27.5755 24L32.8588 29.2833L29.2833 32.8588Z" fill="white" />
            <defs>
              <filter id="filter0_d" x="0" y="0" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
                <feOffset />
                <feGaussianBlur stdDeviation="2" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
              </filter>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default withRedux(NavMobile)