import { Fragment, useEffect, useState } from "react"
import Head from 'next/head'
import { setProfile, addMementoList, setUser, setFollow } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from "react-redux"
import { useRouter } from "next/router"
import ipfs from "../lib/ipfs"
import near from "../lib/near"
import Modal from './Modal'
import axios from 'axios'
import { setLoading } from "../actions/ui"
import NavDesktop from "./NavDesktop"

const DEFAULT_AVATAR = {
  url: 'QmbmkUNfVEQwUHzufSbC5nZQbdEMnNp6Hzfr88sQhZAois',
  type: 'ipfs'
}

const BASE_URL = `https://paras.id`

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-black-1 flex items-center justify-center">
      <div>
        <svg className="rotate-z m-auto" width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M4.28572 39.9438H9.9012L8.47263 28.9771C14.4579 29.839 27.1429 30.1897 30 24.6974C32.8571 30.1897 45.5421 29.839 51.5274 28.9771L50.0988 39.9438H55.7143L60 0L44.331 4.2797C39.0778 5.58738 30 9.73631 30 15.8705C30 9.73631 20.9222 5.58738 15.669 4.2797L0 0L4.28572 39.9438ZM7.85703 5.25234C13.5713 6.67891 25.8376 11.8145 28.6948 20.9446C25.6597 25.4907 19.4788 25.3418 15.6509 25.2477C15.1546 25.2355 14.6957 25.2243 14.2857 25.2243C6.42858 25.2243 7.53768 6.48246 7.85703 5.25234ZM52.143 5.25235C46.4287 6.67892 34.1624 11.8145 31.3053 20.9446C34.3404 25.4907 40.5212 25.3418 44.3491 25.2477C44.8455 25.2355 45.3043 25.2243 45.7143 25.2243C53.5714 25.2243 52.4623 6.48246 52.143 5.25235Z" fill="white" />
        </svg>
        <p className="mt-4 text-white text-center">Preparing Paras</p>
      </div>
    </div>
  )
}

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector(state => state.me.user)
  const me = useSelector(state => state.me.profile)
  const mementoList = useSelector(state => state.me.mementoList)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [onboardingView, setOnboardingView] = useState(0)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [referral, setReferral] = useState('')

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // bug history state undefined
      router.push(router.pathname, window.location.pathname)
      router.push(router.pathname, window.location.pathname)

      ipfs.init()
      if (typeof window !== 'undefined') {
        await near.init()

        if (near.wallet.isSignedIn()) {
          let onboarding = await axios.get(`${BASE_URL}/register/adopters/${near.currentUser.accountId}`)
          if (onboarding.data.success == 0) {
            setShowOnboarding(true)
          }
          let profile = await near.contract.getUserById({
            id: near.currentUser.accountId
          })
          if (!profile) {
            try {
              profile = await near.contract.createUser({
                imgAvatar: DEFAULT_AVATAR,
                bio: ''
              })
            } catch (err) {
              const msg = err.toString()
              if (msg.indexOf('User already exist')) {
                console.log('User already exist')
              }
              else {
                console.log(err)
              }
            }
          }

          const token = await near.authToken()
          axios.defaults.headers.common['Authorization'] = token

          batch(() => {
            dispatch(setUser(near.currentUser))
            dispatch(setProfile(profile))
          })
        }

        setTimeout(() => {
          setIsLoading(false)
        }, 250)
      }
    }
    init()
  }, [])

  useEffect(() => {
    const getUserMementoData = async () => {
      const response = await axios.get(`http://localhost:9090/mementos?owner=${me.id}`)
      dispatch(addMementoList(response.data.data))
    }
    const getUserFollowing = async () => {
      const response = await axios.get(`http://localhost:9090/follow`)
      const followList = response.data.data.map(follow => follow.targetId)
      dispatch(setFollow(followList))
    }
    if (!isLoading && me.id && mementoList.length === 0) {
      getUserMementoData()
      getUserFollowing()
    }
  }, [isLoading, me])

  const _validateSubmit = () => {
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    if (email.length > 0 && email.match(emailRegex) && fullName.length > 0) {
      return true
    }
  }

  const _submitOnboarding = async () => {
    dispatch(setLoading(true, 'Setting your profile...'))
    const newData = {
      username: near.currentUser.accountId,
      email: email,
      fullName: fullName,
      referral: referral,
    }
    await axios.post(`${BASE_URL}/register/adopters`, newData)
    setShowOnboarding(false)
    dispatch(setLoading(false))
  }

  const _logOut = () => {
    near.wallet.signOut()

    window.location.replace(window.location.origin + '/login')
  }

  return (
    <Fragment>
      <Head>
        <title>Paras - People-Powered Decentralized Social Media</title>
        <script async src="https://stat.paras.id/tracker.js" data-ackee-server="https://stat.paras.id" data-ackee-domain-id="fef11e6a-3d7c-4ede-bb9d-64f7b6ef32dc"></script>
      </Head>
      {
        isLoading ? (
          <SplashScreen />
        ) : (
            <div className="bg-dark-0">
              <div className="fixed top-0 z-10 bg-dark-12 w-full h-12"></div>
              <div>
                <div className="flex m-auto">
                  <div className="flex-auto hidden sm:block w-1/3">
                    <NavDesktop />
                  </div>
                  <div className="w-full max-w-md m-auto flex-grow-0 flex-shrink-0">
                    {children}
                  </div>
                  <div className="flex-auto hidden sm:block w-1/3">
                    <div className={`${me && me.id ? 'visible' : 'invisible'} z-10 sticky min-h-screen top-0 flex flex-col w-full`} style={{
                      boxShadow: `0px -0.5px 0px rgba(0, 0, 0, 0.3)`
                    }}>
                      <div className="h-12 px-4 flex items-center bg-dark-12">
                        <div className="mr-auto w-full" style={{
                          maxWidth: `10rem`
                        }}>
                          <p onClick={_ => _logOut()} className="text-white">Logout</p>
                        </div>
                      </div>
                      <div className="ml-auto w-full" style={{
                        maxWidth: `10rem`
                      }}>

                      </div>
                      <div className="w-full mt-6"></div>
                    </div>
                  </div>
                </div>
                {
                  showOnboarding && (
                    <div className="fixed inset-0 bg-dark-0 pt-24 p-8" style={{
                      zIndex: 100
                    }}>
                      <div className="max-w-sm m-auto">
                        {
                          onboardingView == 0 && (
                            <div className="flex flex-col">
                              <div className="flex justify-center">
                                <svg width="100" height="80" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fillRule="evenodd" clipRule="evenodd" d="M2.5 36H5.7757L4.94237 29.4107C8.4338 29.9286 15.8333 30.1393 17.5 26.8393C19.1667 30.1393 26.5662 29.9286 30.0576 29.4107L29.2243 36H32.5L35 12L25.8597 14.5714C22.7954 15.3571 17.5 17.85 17.5 21.5357C17.5 17.85 12.2046 15.3571 9.14025 14.5714L0 12L2.5 36ZM4.58327 15.1558C7.9166 16.013 15.0719 19.0987 16.7386 24.5844C14.9681 27.3159 11.3626 27.2265 9.12971 27.1699C8.84016 27.1626 8.57248 27.1558 8.33335 27.1558C3.75001 27.1558 4.39698 15.8949 4.58327 15.1558ZM30.4167 15.1558C27.0834 16.013 19.9281 19.0987 18.2614 24.5844C20.0319 27.3159 23.6374 27.2265 25.8703 27.1699C26.1599 27.1626 26.4275 27.1558 26.6667 27.1558C31.25 27.1558 30.603 15.8949 30.4167 15.1558Z" fill="#191F2C" />
                                  <path d="M25.0488 1.46341V9.02439H18V1.45122L25.0488 1.46341ZM24.3049 8.12195L22.1341 2.62195H19.5732V3.42683H20.9634L19.0976 8.09756L19.8415 8.40244L20.4756 6.79268H22.9146L23.5732 8.41463L24.3049 8.12195ZM22.6098 6H20.7927L21.7073 3.71951L22.6098 6Z" fill="#191F2C" />
                                  <path d="M32.8773 8.40244L26.4505 9.43902L25.1334 1.26829L31.5724 0.231707L32.8773 8.40244ZM31.4017 7.35366L31.2675 6.51219L28.6212 6.93902L27.8651 2.2561L26.4627 2.4878L26.5968 3.31707L27.17 3.21951L27.9261 7.90244L31.4017 7.35366Z" fill="#191F2C" />
                                  <path d="M35.3932 7.19512C35.6452 7.19512 35.8973 7.17886 36.1493 7.14634C36.4013 7.10569 36.629 7.03252 36.8322 6.92683C37.0355 6.81301 37.2021 6.65854 37.3322 6.46341C37.4623 6.26016 37.5273 5.99187 37.5273 5.65854C37.5273 5.31707 37.4379 5.04878 37.259 4.85366C37.0802 4.65041 36.8525 4.49593 36.5761 4.39024C36.2997 4.28455 35.9908 4.21951 35.6493 4.19512C35.3078 4.1626 34.9786 4.14634 34.6615 4.14634C34.4908 4.14634 34.3241 4.15041 34.1615 4.15854C34.007 4.15854 33.8647 4.15854 33.7347 4.15854L33.7103 4.90244L34.1127 4.92683L34.0273 9.14634H34.7712L34.8322 7.18293C34.9298 7.19106 35.0233 7.19512 35.1127 7.19512C35.2103 7.19512 35.3038 7.19512 35.3932 7.19512ZM36.7712 5.67073C36.7712 5.84146 36.7347 5.97967 36.6615 6.08537C36.5964 6.18293 36.503 6.26016 36.381 6.31707C36.2672 6.37398 36.1371 6.41463 35.9908 6.43902C35.8444 6.45528 35.694 6.46341 35.5395 6.46341C35.442 6.46341 35.3363 6.46341 35.2225 6.46341C35.1086 6.45528 34.9826 6.44715 34.8444 6.43902L34.881 4.91463C35.5314 4.91463 36.007 4.95935 36.3078 5.04878C36.6168 5.13008 36.7712 5.3374 36.7712 5.67073ZM38.3322 10L32.7469 9.89024L32.881 3.58537L38.4664 3.70732L38.3322 10Z" fill="#191F2C" />
                                  <path d="M44.2445 3.91463L43.9274 9.73171L38.9274 9.47561L39.2323 3.64634L44.2445 3.91463ZM43.3298 4.7439L42.7567 4.71951L42.6957 6.18293L41.0737 6.09756L41.1469 4.63415L40.1835 4.59756L40.1347 5.15854L40.5494 5.17073L40.3786 8.26829L40.9396 8.31707L41.025 6.65854L42.6469 6.7439L42.5615 8.40244L43.1347 8.42683L43.3298 4.7439Z" fill="#191F2C" />
                                  <path d="M51.3541 0.707317L50.598 7.46341L44.2932 6.76829L45.0493 0L51.3541 0.707317ZM50.0127 6.58537L48.6346 1.46341L46.3419 1.19512L46.2688 1.91463L47.5005 2.06098L45.3663 6.03658L46.0005 6.39024L46.7322 5.02439L48.9029 5.2561L49.3297 6.78049L50.0127 6.58537ZM48.72 4.52439L47.0858 4.34146L48.1468 2.39024L48.72 4.52439Z" fill="#191F2C" />
                                </svg>
                              </div>
                              <p className="mt-4">Thank you for your interest in becoming part of the early adopters. Building a social media is hard, that's why we need your help to help us shape this new kind of social media.</p>
                              <p className="mt-4">if you have ideas or feedback please share it with us at <a className="text-black-2 underline font-semibold" href="http://ideas.paras.id" target="_blank">https://ideas.paras.id</a></p>
                              <button className="mt-8 w-full rounded-md p-2 bg-black-1 text-white font-semibold" onClick={() => setOnboardingView(1)}>Next</button>
                            </div>
                          )
                        }
                        {
                          onboardingView == 1 && (
                            <div className="flex flex-col">
                              <p className="text-xl font-bold">Set up Profile</p>
                              <div className="mt-4">
                                <label>Fullname</label>
                                <input placeholder="Your fullname" className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                              </div>
                              <div className="mt-4">
                                <label>Email</label>
                                <input placeholder="Your email address" className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                              </div>
                              <div className="mt-4">
                                <label>How do you know Paras?</label>
                                <textarea placeholder="Tell us how do you get here (optional)" className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" value={referral} onChange={e => setReferral(e.target.value)} />
                              </div>
                              <div className="mt-4">
                                <button disabled={!_validateSubmit()} className="w-full rounded-md p-2 bg-black-1 text-white font-semibold" onClick={() => _submitOnboarding()}>Enter Paras</button>
                              </div>
                            </div>
                          )
                        }
                      </div>
                    </div>
                  )
                }
              </div>
            </div>
          )
      }
    </Fragment>
  )
}

export default withRedux(Layout)