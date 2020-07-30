import React, { useState, useEffect } from 'react'
import HomeScreen from '../screens/HomeScreen'
import Head from 'next/head'
import FeedScreen from 'screens/FeedScreen'
import NavTop from 'components/NavTop'
import { batch, useSelector, useDispatch } from 'react-redux'
import { setPageActive, setPageScroll } from 'actions/home'
import ExploreScreen from 'screens/ExploreScreen'

const HomePage = () => {
  const dispatch = useDispatch()
  const me = useSelector(state => state.me.profile)
  const pageActive = useSelector(state => state.home.pageActive)
  const pageScroll = useSelector(state => state.home.pageScroll)

  const _navigate = (to) => {
    const clonePageScroll = { ...pageScroll }
    if (!clonePageScroll[pageActive]) {
      clonePageScroll[pageActive] = {}
    }
    clonePageScroll[pageActive].scrollY = window.scrollY
    batch(() => {
      dispatch(setPageScroll(clonePageScroll))
      dispatch(setPageActive(to))
    })
  }

  useEffect(() => {
    if (pageScroll[pageActive] && pageScroll[pageActive].scrollY) {
      window.requestAnimationFrame(() => window.scrollTo(0, pageScroll[pageActive].scrollY))
    }
    else {
      window.requestAnimationFrame(() => window.scrollTo(0, 0))
    }
  }, [pageActive])

  return (
    <div>
      <Head>
        <title>Paras - Digital Collective Memory</title>
        <meta name="description" content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />

        <meta name='twitter:title' content='Paras - Digital Collective Memory' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name="twitter:site" content="@ParasHQ" />
        <meta name='twitter:url' content='https://alpha.paras.id' />
        <meta name='twitter:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
        <meta name='twitter:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Paras - Digital Collective Memory' />
        <meta property='og:site_name' content='Paras - Digital Collective Memory' />
        <meta property='og:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
        <meta property='og:url' content='https://alpha.paras.id' />
        <meta property='og:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
      </Head>
      <div>
        {
          me.id ? (
            <div>
              <NavTop
                center={
                  <div className="flex justify-center ">
                    <h3
                      onClick={() => _navigate('editorsPick')}
                      className={`text-white text-lg mx-2 cursor-pointer ${pageActive === 'editorsPick' && 'font-bold'}`}>
                      Picks
                    </h3>
                    <h3
                      onClick={() => _navigate('following')}
                      className={`text-white text-lg mx-2 cursor-pointer ${pageActive === 'following' && 'font-bold'}`}>
                      Following
                    </h3>
                  </div>
                }
              />
              {
                pageActive === 'editorsPick' ? (
                  <FeedScreen id="editorsPick" />
                ) : (
                    <HomeScreen />
                  )
              }
            </div>
          ) : (
            <ExploreScreen />
          )
        }
      </div>
    </div>
  )
}

export default HomePage
