import { useDispatch, useSelector } from 'react-redux'
import { setActivePage, toggleNewBlock } from '../actions/ui'
import { withRedux } from '../lib/redux'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Push from './Push'
import Image from './Image'

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
      <div className={
        `flex h-full items-center justify-center relative
        ${activePage === name ? `text-primary-5` : 'text-white'}
      `}>
        {children}
      </div>
    </span>
  )
}

const NavMobile = () => {
  const activePage = useSelector(state => state.ui.activePage)
  const profile = useSelector(state => state.me.profile)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    switch (router.asPath) {
      case '/':
        dispatch(setActivePage('feed'))
        break
      case '/explore':
        dispatch(setActivePage('explore'))
        break
      case '/wallet':
        dispatch(setActivePage('wallet'))
        break
      case `/${profile.id}`:
        dispatch(setActivePage('me'))
        break
    }
  }, [profile, router])

  return (
    <div className={
      `${profile && profile.id ? 'visible' : 'invisible'} 
      block sm:hidden flex h-12 w-full bg-dark-12`}
    >
      <div className="w-1/5">
        <NavLink name="feed" href="/" as="/" activePage={activePage} >
          <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M5.88867 10L11.89 3.99867L17.8913 10H17.89V20H5.89001L5.89001 10H5.88867ZM3.89001 11.9987L2.4132 13.4755L1 12.0623L10.477 2.58529C11.2574 1.8049 12.5226 1.8049 13.303 2.58529L22.78 12.0623L21.3668 13.4755L19.89 11.9987V20C19.89 21.1046 18.9946 22 17.89 22H5.89001C4.78545 22 3.89001 21.1046 3.89001 20L3.89001 11.9987Z" />
          </svg>
        </NavLink>
      </div>
      <div className="w-1/5">
        <NavLink name="explore" href="/explore" as="/explore" activePage={activePage}>
          <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14 8H10V6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10H8L8 14H6C3.79086 14 2 15.7909 2 18C2 20.2091 3.79086 22 6 22C8.20914 22 10 20.2091 10 18V16H14V18C14 20.2091 15.7909 22 18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14H16V10H18C20.2091 10 22 8.20914 22 6C22 3.79086 20.2091 2 18 2C15.7909 2 14 3.79086 14 6V8ZM10 14V10H14V14H10ZM16 16V18C16 19.1046 16.8954 20 18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16H16ZM6 16H8V18C8 19.1046 7.10457 20 6 20C4.89543 20 4 19.1046 4 18C4 16.8954 4.89543 16 6 16ZM16 8H18C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6V8ZM8 6V8H6C4.89543 8 4 7.10457 4 6C4 4.89543 4.89543 4 6 4C7.10457 4 8 4.89543 8 6Z" />
          </svg>
        </NavLink>
      </div>
      <div className="w-1/5">
        <Push href="/new/post" as="/new/post">
          <a className="flex items-center justify-center h-full">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15" fill="#E13128" stroke="#E13128" strokeWidth="2" />
              <path fillRule="evenodd" clipRule="evenodd" d="M14.5408 22.3337V17.4598H9.66699V14.5408H14.5408V9.66699H17.4598V14.5408H22.3337V17.4598H17.4598V22.3337H14.5408Z" fill="white" />
            </svg>
          </a>
        </Push>
      </div>
      <div className="w-1/5">
        <NavLink name="wallet" href="/wallet" as="/wallet" activePage={activePage} >
          <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M21 7C22.1046 7 23 7.89543 23 9V11H19C17.3431 11 16 12.3431 16 14C16 15.6569 17.3431 17 19 17H23V19C23 20.1046 22.1046 21 21 21H3C1.89543 21 1 20.1046 1 19V5.5C1 4.39543 1.89543 3.5 3 3.5H17C18.1046 3.5 19 4.39543 19 5.5H4.25C3.83579 5.5 3.5 5.83579 3.5 6.25C3.5 6.66421 3.83579 7 4.25 7H21ZM19 12.5C18.1716 12.5 17.5 13.1716 17.5 14C17.5 14.8284 18.1716 15.5 19 15.5H23V12.5H19Z" />
          </svg>
        </NavLink>
      </div>
      <div className="w-1/5">
        <NavLink name="me" href="/[id]" as={`/${profile.id}`} activePage={activePage} >
          <div className="w-8 h-8 overflow-hidden rounded-full border-2 border-current">
            <Image data={profile.imgAvatar} />
          </div>
        </NavLink>
      </div>
    </div>
  )
}

export default withRedux(NavMobile)