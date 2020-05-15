import { Fragment, useEffect, useState } from "react"
import Head from 'next/head'
import { setProfile, addBlockList, setUser } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from "react-redux"
import axios from "axios"
import { useRouter } from "next/router"
import ipfs from "../lib/ipfs"
import near from "../lib/near"

const DEFAULT_AVATAR = {
  url: 'QmbyiNskTRPLHyVGUVoRrxrStevj4RA7Umn1tyH5wywoLA',
  type: 'ipfs'
}

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 bg-black-1 flex items-center justify-center">
<svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M4.28572 39.9438H9.9012L8.47263 28.9771C14.4579 29.839 27.1429 30.1897 30 24.6974C32.8571 30.1897 45.5421 29.839 51.5274 28.9771L50.0988 39.9438H55.7143L60 0L44.331 4.2797C39.0778 5.58738 30 9.73631 30 15.8705C30 9.73631 20.9222 5.58738 15.669 4.2797L0 0L4.28572 39.9438ZM7.85703 5.25234C13.5713 6.67891 25.8376 11.8145 28.6948 20.9446C25.6597 25.4907 19.4788 25.3418 15.6509 25.2477C15.1546 25.2355 14.6957 25.2243 14.2857 25.2243C6.42858 25.2243 7.53768 6.48246 7.85703 5.25234ZM52.143 5.25235C46.4287 6.67892 34.1624 11.8145 31.3053 20.9446C34.3404 25.4907 40.5212 25.3418 44.3491 25.2477C44.8455 25.2355 45.3043 25.2243 45.7143 25.2243C53.5714 25.2243 52.4623 6.48246 52.143 5.25235Z" fill="white"/>
</svg>
    </div>
  )
}

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const user = useSelector(state => state.me.user)
  const profile = useSelector(state => state.me.profile)
  const mementoList = useSelector(state => state.me.blockList)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      ipfs.init()
      if(typeof window !== 'undefined') {
        await near.init()

        //
        // const x = await near.contract.devDeleteAllUser()
        // console.log(x)
        //

        if(near.wallet.isSignedIn()) {
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
        <title>Paras</title>
      </Head>
        {
          isLoading ? (
            <SplashScreen />
          ) : (
            <div className="max-w-sm m-auto mobile">
              { children }
            </div>
          )
        }
    </Fragment>
  )
}

export default withRedux(Layout)