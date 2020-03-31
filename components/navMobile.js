import NewPost from "./newPost"
import { useDispatch, useSelector } from "react-redux"
import { toggleNewPost } from "../actions/ui"
import { withRedux } from "../lib/redux"
import NewBlock from "./newBlock"
import { useRouter } from "next/router"
import Link from 'next/link'

const isActive = (path, target) => {
  if(path === target) {
    return true
  }
}

const NavMobile = () => {
  const showNewPost = useSelector(state => state.ui.showNewPost)
  const dispatch = useDispatch()
  const router = useRouter()

  return (
    <div className="flex h-12 w-full bg-white" style={{
      boxShadow: `0px -0.5px 0px rgba(0, 0, 0, 0.3)`
    }}>
      <Link href="/">
        <div className={`w-1/5 flex items-center justify-center relative ${isActive(router.pathname, '/') ? `text-black-1` : `text-black-3`}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M5.88867 10L11.89 3.99867L17.8913 10H17.89V20H5.89001L5.89001 10H5.88867ZM3.89001 11.9987L2.4132 13.4755L1 12.0623L10.477 2.58529C11.2574 1.8049 12.5226 1.8049 13.303 2.58529L22.78 12.0623L21.3668 13.4755L19.89 11.9987V20C19.89 21.1046 18.9946 22 17.89 22H5.89001C4.78545 22 3.89001 21.1046 3.89001 20L3.89001 11.9987Z"/>
          </svg>
          {
            isActive(router.pathname, '/') && (
              <div className="absolute bottom-0 p-1">
                <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2" cy="2" r="2" fill="#222222"/>
                </svg>
              </div>
            )
          }
        </div>
      </Link>
      <Link href="/hub">
        <div className={`w-1/5 flex items-center justify-center relative ${isActive(router.pathname, '/hub') ? `text-black-1` : `text-black-3`}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M14 8H10V6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10H8L8 14H6C3.79086 14 2 15.7909 2 18C2 20.2091 3.79086 22 6 22C8.20914 22 10 20.2091 10 18V16H14V18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14H16V10H18C20.2091 10 22 8.20914 22 6C22 3.79086 20.2091 2 18 2C15.7909 2 14 3.79086 14 6V8ZM10 14V10H14V14H10ZM16 16V18C16 19.1046 16.8954 20 18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16H16ZM6 16H8V18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16ZM16 8H18C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6V8ZM8 6V8H6C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z"/>
          </svg>
          {
            isActive(router.pathname, '/hub') && (
              <div className="absolute bottom-0 p-1">
                <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2" cy="2" r="2" fill="#222222"/>
                </svg>
              </div>
            )
          }
        </div>
      </Link>
      <div className="w-1/5 flex justify-center">
        <div onClick={e => dispatch(toggleNewPost(!showNewPost))} className="relative" style={{
          top: `-40%`
        }}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      </div>
      <Link href="/message">
        <div className={`w-1/5 flex items-center justify-center relative ${isActive(router.pathname, '/message') ? `text-black-1` : `text-black-3`}`}>
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M0 6.89287L7.72163 12.6841L8.40377 12.2748L7.99448 12.9569L13.7857 20.6786L20.6786 1.52588e-05L0 6.89287ZM7.84579 10.2772L4.25371 7.58315L17.5163 3.16229L13.0954 16.4249L10.4014 12.8328L14.2347 6.44385L7.84579 10.2772Z" fill="#616161"/>
          </svg>
          {
            isActive(router.pathname, '/message') && (
              <div className="absolute bottom-0 p-1">
                <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2" cy="2" r="2" fill="#222222"/>
                </svg>
              </div>
            )
          }
        </div>
      </Link>
      <Link href="/profile">
        <div className={`w-1/5 flex items-center justify-center relative ${isActive(router.pathname, '/profile') ? `text-black-1` : `text-black-3`}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="12" cy="6.5" rx="4" ry="4.5" stroke="#616161" strokeWidth="2.2"/>
            <path d="M20 19C20 22.5 16 21.5 12 21.5C8 21.5 4 22.5 4 19C4 17 7.58172 14.5 12 14.5C16.4183 14.5 20 17 20 19Z" stroke="#616161" strokeWidth="2.2"/>
          </svg>
          {
            isActive(router.pathname, '/profile') && (
              <div className="absolute bottom-0 p-1">
                <svg width="4" height="4" viewBox="0 0 4 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="2" cy="2" r="2" fill="#222222"/>
                </svg>
              </div>
            )
          }
        </div>
      </Link>
      <NewPost /> 
      <NewBlock />
    </div>
  )
}

export default withRedux(NavMobile)