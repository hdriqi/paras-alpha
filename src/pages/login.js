import React, { useState, useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { withRedux } from '../lib/redux'
import { setProfile } from '../actions/me'
import near from '../lib/near'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const currentUser = useSelector(state => state.me.user)
  const router = useRouter()

  const dispatch = useDispatch()

  useEffect(() => {
    if(currentUser) {
      router.push('/', '/')
    }
  }, [currentUser])

  const _login = async (e) => {
    e.preventDefault()

    const userRes = await axios.get(`https://internal-db.dev.paras.id/users?username=${username}`)
    if(userRes.data.length > 0) {
      // set local storage
      const me = userRes.data[0]
      window.localStorage.setItem('meId', me.id)
      window.localStorage.setItem('meUsername', me.username)
      dispatch(setProfile(me))
    }
    else {
      // create new
      const id = Math.random().toString(36).substr(2, 9)

      const newData = {
        id: id,
        username: username,
        following: [],
        avatarUrl: 'https://siasky.net/AAC0MXtp6rYKoyOsRpcZ29zcLgmykmZDD64LR4fLkRj6_A',
        bio: '',
        createdAt: new Date().toISOString()
      }

      await axios.post(`https://internal-db.dev.paras.id/users`, newData)

      window.localStorage.setItem('meId', id)
      window.localStorage.setItem('meUsername', username)
      dispatch(setProfile(newData))
    }
    
    router.replace('/')
  }

  const _signIn = async () => {
    const appTitle = 'Paras Internal'
    await near.wallet.requestSignIn(
      near.config.contractName,
      appTitle
    )
  }

  return (
    <div className="max-w-sm m-auto">
      <div className="flex items-center justify-center h-screen">
        <div className="w-full p-4">
          <div>
            <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M4.28572 39.9438H9.9012L8.47263 28.9771C14.4579 29.839 27.1429 30.1897 30 24.6974C32.8571 30.1897 45.5421 29.839 51.5274 28.9771L50.0988 39.9438H55.7143L60 0L44.331 4.27969C39.0778 5.58738 30 9.73631 30 15.8705C30 9.73631 20.9222 5.58738 15.669 4.27969L0 0L4.28572 39.9438ZM7.85703 5.25234C13.5713 6.67891 25.8376 11.8145 28.6948 20.9446C25.6597 25.4907 19.4788 25.3418 15.6509 25.2477C15.1546 25.2355 14.6957 25.2243 14.2857 25.2243C6.42858 25.2243 7.53768 6.48246 7.85703 5.25234ZM52.143 5.25235C46.4287 6.67892 34.1624 11.8145 31.3053 20.9446C34.3404 25.4907 40.5212 25.3418 44.3491 25.2477C44.8455 25.2355 45.3043 25.2243 45.7143 25.2243C53.5714 25.2243 52.4623 6.48246 52.143 5.25235Z" fill="#1B1B1B"/>
            </svg>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl text-black-1 font-semibold">Welcome Back,</h3>
            <p className="text-black-3">Log in to Paras</p>
          </div>
          <button onClick={() => _signIn()} className="w-full rounded-md p-2 bg-black-1 text-white font-semibold">Login with NEAR</button>
          {/* <form className="mt-8" onSubmit={e => _login(e)}>
            <div>
              <label className="block text-sm pb-1 font-semibold text-black-2">Username</label>
              <input className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" onChange={e => setUsername(e.target.value)} value={username} placeholder="Your username" />
            </div>
            <div className="mt-6">
              <button className="w-full rounded-md p-2 bg-black-1 text-white font-semibold" type="submit">Login</button>
            </div>
          </form> */}
        </div>
      </div>
    </div>
  )
}

export default withRedux(LoginPage)