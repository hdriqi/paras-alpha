import { Fragment, useEffect, useState } from "react"
import Head from 'next/head'
import { setProfile, addBlockList, setUser } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from "react-redux"
import { useRouter } from "next/router"
import ipfs from "../lib/ipfs"
import near from "../lib/near"
import Modal from './Modal'

const DEFAULT_AVATAR = {
  url: 'QmbmkUNfVEQwUHzufSbC5nZQbdEMnNp6Hzfr88sQhZAois',
  type: 'ipfs'
}

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-black-1 flex items-center justify-center">
      <div>
        <svg className="rotate-z m-auto" width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M4.28572 39.9438H9.9012L8.47263 28.9771C14.4579 29.839 27.1429 30.1897 30 24.6974C32.8571 30.1897 45.5421 29.839 51.5274 28.9771L50.0988 39.9438H55.7143L60 0L44.331 4.2797C39.0778 5.58738 30 9.73631 30 15.8705C30 9.73631 20.9222 5.58738 15.669 4.2797L0 0L4.28572 39.9438ZM7.85703 5.25234C13.5713 6.67891 25.8376 11.8145 28.6948 20.9446C25.6597 25.4907 19.4788 25.3418 15.6509 25.2477C15.1546 25.2355 14.6957 25.2243 14.2857 25.2243C6.42858 25.2243 7.53768 6.48246 7.85703 5.25234ZM52.143 5.25235C46.4287 6.67892 34.1624 11.8145 31.3053 20.9446C34.3404 25.4907 40.5212 25.3418 44.3491 25.2477C44.8455 25.2355 45.3043 25.2243 45.7143 25.2243C53.5714 25.2243 52.4623 6.48246 52.143 5.25235Z" fill="white"/>
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
  const profile = useSelector(state => state.me.profile)
  const mementoList = useSelector(state => state.me.blockList)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [referral, setReferral] = useState('')

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      // bug history state undefined
      if(router.asPath === '/') {
        router.push(router.asPath)
        router.push(router.asPath)
      }

      ipfs.init()
      if(typeof window !== 'undefined') {
        await near.init()

        //
        // await near.contract.devDeleteAllUser()
        // await near.contract.devDeleteAllPost()
        // await near.contract.devDeleteAllMemento()
        // await near.contract.devDeleteAllComment()
        //

        if(near.wallet.isSignedIn()) {
          let onboarding = await axios.get('http://localhost:8000/register/adopters', {
            username: near.currentUser.accountId
          })
          if(!onboarding) {
            setShowOnboarding(true)
          }
          let profile = await near.contract.getUserByUsername({
            username: near.currentUser.accountId
          })
          if(!profile) {
            try {
              profile = await near.contract.createUser({
                imgAvatar: DEFAULT_AVATAR, 
                bio: '', 
                bioRaw: ''
              }) 
            } catch (err) {
              const msg = err.toString()
              if(msg.indexOf('User already exist')) {
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
      const query = [`owner:=${profile.username}`]
      const mementoList = await near.contract.getMementoList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })

      dispatch(addBlockList(mementoList))
    }
    if(!isLoading && profile.id && mementoList.length === 0) {
      getUserMementoData()
    }
  }, [isLoading, profile])
  
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
            <div className="max-w-sm m-auto mobile shadow-subtle">
              { children }
              {
                showOnboarding && (
                  <Modal style={{
                    backgroundColor: `white`
                  }} close={() => setShowOnboarding(false)}>
                    <div className="flex flex-col text-center">
                      <div>
                        <label>Fullname</label>
                        <input className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                      </div>
                      <div>
                        <label>Email</label>
                        <input className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" value={email} onChange={e => setEmail(e.target.value)} />
                      </div>
                      <div>
                        <label>How do you know Paras?</label>
                        <textarea className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" value={referral} onChange={e => setReferral(e.target.value)} />
                      </div>
                      {/* <button className="py-2 font-medium" onClick={() => setConfirmLogout(false)}>Cancel</button> */}
                    </div>
                  </Modal>
                )
              }
            </div>
          )
        }
    </Fragment>
  )
}

export default withRedux(Layout)