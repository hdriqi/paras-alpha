import { Fragment, useEffect, useState, useContext } from "react"
import Head from 'next/head'
import { setProfile, addMementoList, setUser, setFollow } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from "react-redux"
import { useRouter } from "next/router"
import ipfs from "../lib/ipfs"
import near from "../lib/near"
import axios from 'axios'
import { setLoading } from "../actions/ui"
import { setBalance } from "actions/wallet"
import { NotifyContext } from "./Utils/NotifyProvider"
import * as rax from 'retry-axios'

const DEFAULT_AVATAR = [
  {
    url: 'QmWvmboVv5wgApgwPcVns3HF3FKpgXSezqtkrJoq5xriCH',
    type: 'ipfs'
  },
  {
    url: 'Qmab3Umre1GmXuSnkh9wxdr4QNSVtV8DBTLQBRPFbJbUUS',
    type: 'ipfs'
  },
  {
    url: 'QmfBxyRh5RwBAtB85Q6EGQEfNfprCDdz5mNu3HhLWynpo3',
    type: 'ipfs'
  },
  {
    url: 'QmRSFZvUwWD61wyYeuYC2B9Z8JPxXXHFmTHeGeRFi7Bn7L',
    type: 'ipfs'
  },
  {
    url: 'QmYBBFGBZV17oJb9HFQNB7EHmhDMo94GBPBdFnQEqSmF94',
    type: 'ipfs'
  },
  {
    url: 'QmcUhG6UjqUYKydg7KoAmTok4TSwRXhrvCLb5gciSzatig',
    type: 'ipfs'
  },
  {
    url: 'QmX6mc7wfDza8mDFMDGfmZsUQNZv1LhP8ztEURmHZf1xAF',
    type: 'ipfs'
  },
  {
    url: 'Qmdqg7bCjiKagvt421qhGdX5A6jXrAFVaUvxY6DwZMzLtE',
    type: 'ipfs'
  },
  {
    url: 'QmYeGSYCn14ppxnP26D5p9W8NRgPEBqkfkYfoAULCfKhyE',
    type: 'ipfs'
  },
  {
    url: 'QmQa68qLbW7iSSVNaS8o1rW9PiCYVoAneqn17D4oz6fbGu',
    type: 'ipfs'
  },
]

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-black-1 flex items-center justify-center" style={{
      zIndex: 100
    }}>
      <div>
        <svg className="rotate-z m-auto" width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M4.28572 39.9438H9.9012L8.47263 28.9771C14.4579 29.839 27.1429 30.1897 30 24.6974C32.8571 30.1897 45.5421 29.839 51.5274 28.9771L50.0988 39.9438H55.7143L60 0L44.331 4.2797C39.0778 5.58738 30 9.73631 30 15.8705C30 9.73631 20.9222 5.58738 15.669 4.2797L0 0L4.28572 39.9438ZM7.85703 5.25234C13.5713 6.67891 25.8376 11.8145 28.6948 20.9446C25.6597 25.4907 19.4788 25.3418 15.6509 25.2477C15.1546 25.2355 14.6957 25.2243 14.2857 25.2243C6.42858 25.2243 7.53768 6.48246 7.85703 5.25234ZM52.143 5.25235C46.4287 6.67892 34.1624 11.8145 31.3053 20.9446C34.3404 25.4907 40.5212 25.3418 44.3491 25.2477C44.8455 25.2355 45.3043 25.2243 45.7143 25.2243C53.5714 25.2243 52.4623 6.48246 52.143 5.25235Z" fill="white" />
        </svg>
        <p className="mt-4 text-white text-center">Preparing Paras</p>
      </div>
    </div>
  )
}

const sleep = (ms = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const useNotify = useContext(NotifyContext)
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
          const token = await near.authToken()
          rax.attach()
          axios.defaults.headers.common['Authorization'] = token

          // await sleep(500)

          let response = await axios.get(`${process.env.BASE_URL}/register`, {
            raxConfig: {
              retry: 5,
              retryDelay: 500,
              statusCodesToRetry: [[400, 499]]
            }
          })

          if (!response.data.data) {
            setShowOnboarding(true)
          }
          let profile = await near.contract.getUserById({
            id: near.currentUser.accountId
          })
          if (!profile) {
            const avatar = DEFAULT_AVATAR[Math.floor(Math.random() * DEFAULT_AVATAR.length)]
            try {
              profile = await near.contract.createUser({
                imgAvatar: avatar,
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
      const response = await axios.get(`${process.env.BASE_URL}/mementos?owner=${me.id}`)
      dispatch(addMementoList(response.data.data))
    }
    const getUserFollowing = async () => {
      const response = await axios.get(`${process.env.BASE_URL}/follow`)
      const followList = response.data.data.map(follow => follow.targetId)
      dispatch(setFollow(followList))
    }
    const getUserBalance = async () => {
      const response = await axios.get(`${process.env.BASE_URL}/balances/${me.id}`)
      dispatch(setBalance(response.data.data))
    }
    if (!isLoading && me.id && mementoList.length === 0) {
      getUserMementoData()
      getUserFollowing()
      getUserBalance()
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
    try {
      await axios.post(`${process.env.BASE_URL}/register`, newData)
      setOnboardingView(2)
    } catch (err) {
      if (err.response.data.message === 'already_registered') {
        useNotify.setText('Email already registered!')
        useNotify.setShow(true, 2500)
      }
    }
    dispatch(setLoading(false))
  }

  return (
    <Fragment>
      <div className="bg-dark-0">
        <div>
          <div className="fixed top-0 z-10 bg-dark-12 w-full h-12"></div>
          <div>
            {children}
          </div>
          {
            showOnboarding && (
              <div className="fixed inset-0 bg-dark-0 p-8" style={{
                zIndex: 40
              }}>
                <div className="max-w-sm m-auto flex items-center h-full">
                  {
                    onboardingView == 0 && (
                      <div className="flex flex-col w-full">
                        <div className="flex justify-center">
                          <svg width="99" height="71" viewBox="0 0 99 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M48.1706 3.19922V17.7396H34.6152V3.17578L48.1706 3.19922ZM46.74 16.0041L42.5654 5.42718H37.6406V6.97503H40.3141L36.726 15.9572L38.1566 16.5435L39.376 13.4478H44.0664L45.3329 16.567L46.74 16.0041ZM43.4802 11.9234H39.9858L41.7447 7.53788L43.4802 11.9234Z" fill="white" />
                            <path d="M63.2256 16.543L50.8664 18.5364L48.3335 2.82351L60.7162 0.830078L63.2256 16.543ZM60.3879 14.5261L60.1298 12.9079L55.0408 13.7288L53.5868 4.72314L50.8898 5.16872L51.1477 6.76347L52.25 6.57585L53.7041 15.5815L60.3879 14.5261Z" fill="white" />
                            <path d="M68.0636 14.2211C68.5483 14.2211 69.0331 14.1899 69.5177 14.1273C70.0023 14.0491 70.4402 13.9084 70.831 13.7052C71.2219 13.4863 71.5423 13.1892 71.7925 12.814C72.0427 12.4231 72.1677 11.9072 72.1677 11.2662C72.1677 10.6095 71.9958 10.0935 71.6517 9.71832C71.3079 9.32745 70.87 9.03037 70.3385 8.82712C69.8069 8.62387 69.2129 8.4988 68.5562 8.45189C67.8994 8.38935 67.2663 8.35809 66.6565 8.35809C66.3283 8.35809 66.0077 8.36591 65.695 8.38155C65.3979 8.38155 65.1242 8.38155 64.8742 8.38155L64.8273 9.81212L65.6012 9.85903L65.4369 17.9735H66.8675L66.9848 14.1977C67.1725 14.2133 67.3523 14.2211 67.5242 14.2211C67.7119 14.2211 67.8917 14.2211 68.0636 14.2211ZM70.7136 11.2896C70.7136 11.6179 70.6435 11.8837 70.5027 12.087C70.3775 12.2746 70.1979 12.4231 69.9633 12.5326C69.7444 12.642 69.4942 12.7202 69.2129 12.7671C68.9313 12.7984 68.6421 12.814 68.345 12.814C68.1575 12.814 67.9542 12.814 67.7354 12.814C67.5163 12.7984 67.274 12.7827 67.0083 12.7671L67.0787 9.83557C68.3294 9.83557 69.244 9.92157 69.8225 10.0935C70.4167 10.2499 70.7136 10.6486 70.7136 11.2896ZM73.7156 19.6151L62.9746 19.404L63.2325 7.2793L73.9736 7.51382L73.7156 19.6151Z" fill="white" />
                            <path d="M85.0855 7.91243L84.4757 19.0991L74.8604 18.6066L75.4467 7.39648L85.0855 7.91243ZM83.3265 9.50718L82.2244 9.46027L82.1071 12.2745L78.9879 12.1104L79.1286 9.29612L77.2759 9.22575L77.1821 10.3046L77.9796 10.328L77.6511 16.2848L78.73 16.3787L78.8942 13.1892L82.0132 13.3533L81.849 16.5428L82.9513 16.5897L83.3265 9.50718Z" fill="white" />
                            <path d="M98.7579 1.74499L97.3038 14.7375L85.1792 13.4007L86.6332 0.384766L98.7579 1.74499ZM96.1782 13.0489L93.528 3.19902L89.119 2.68307L88.9784 4.06675L91.3471 4.34819L87.2428 11.9936L88.4625 12.6737L89.8696 10.0471L94.044 10.4927L94.8648 13.4242L96.1782 13.0489ZM93.6923 9.08552L90.5496 8.73373L92.59 4.98138L93.6923 9.08552Z" fill="white" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M5 71H11.5514L9.88473 58.096C16.8676 59.1101 31.6667 59.5228 35 53.0603C38.3333 59.5228 53.1324 59.1101 60.1153 58.096L58.4486 71H65L70 24L51.7195 29.0357C45.5908 30.5744 35 35.4562 35 42.6741C35 35.4562 24.4092 30.5744 18.2805 29.0357L0 24L5 71ZM9.16653 30.1802C15.8332 31.8588 30.1439 37.9016 33.4772 48.6445C29.9363 53.9937 22.7253 53.8185 18.2594 53.7078C17.6803 53.6935 17.145 53.6802 16.6667 53.6802C7.50001 53.6802 8.79396 31.6276 9.16653 30.1802ZM60.8335 30.1802C54.1668 31.8588 39.8561 37.9016 36.5228 48.6445C40.0638 53.9937 47.2748 53.8185 51.7406 53.7078C52.3197 53.6935 52.8551 53.6802 53.3333 53.6802C62.5 53.6802 61.2061 31.6276 60.8335 30.1802Z" fill="white" />
                          </svg>
                        </div>
                        <p className="mt-4 text-white">Thank you for your interest in becoming part of the early adopters. Building a social media is hard, that's why we need your help to shape this new kind of social media.</p>
                        <p className="mt-4 text-white">If you have ideas or feedback please share it with us at <a className="text-white-2 hover:text-white underline font-semibold" href="http://ideas.paras.id" target="_blank">https://ideas.paras.id</a></p>
                        <button className="mt-8 w-full rounded-md p-2 bg-primary-5 text-white font-semibold" onClick={() => setOnboardingView(1)}>Next</button>
                      </div>
                    )
                  }
                  {
                    onboardingView == 1 && (
                      <div className="flex flex-col w-full">
                        <p className="text-xl text-white font-bold">Set up Profile</p>
                        <div className="mt-4">
                          <label className="block text-sm pb-1 font-semibold text-white">Fullname</label>
                          <input placeholder="Your fullname" className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm pb-1 font-semibold text-white">Email</label>
                          <input placeholder="Your email address" className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm pb-1 font-semibold text-white">How do you know Paras?</label>
                          <textarea placeholder="Tell us how do you get here (optional)" className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" type="text" value={referral} onChange={e => setReferral(e.target.value)} />
                        </div>
                        <div className="mt-4">
                          <button disabled={!_validateSubmit()} className="w-full rounded-md p-2 bg-primary-5 text-white font-semibold" onClick={() => _submitOnboarding()}>Next</button>
                        </div>
                      </div>
                    )
                  }
                  {
                    onboardingView == 2 && (
                      <div className="flex flex-col">
                        <p className="mt-4 text-white">We've just sent you an email with a link to verify the email and to claim your 100 Ⓟ</p>
                        <p className="mt-4 text-white">If you don't see the email in few minutes, check your spam folder just in case the email got delivered there</p>
                        <div className="mt-4">
                          <button className="w-full rounded-md p-2 bg-primary-5 text-white font-semibold" onClick={() => setShowOnboarding(false)}>Enter Paras</button>
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
      {
        isLoading && (
          <SplashScreen />
        )
      }
    </Fragment>
  )
}

export default withRedux(Layout)