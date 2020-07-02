import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import { withRedux } from '../lib/redux'
import ProfileScreen from '../screens/ProfileScreen'
import Head from 'next/head'

const UserPage = () => {
  const router = useRouter()

  return (
    <Fragment>
      <Head>
        <meta name='twitter:card' content='summary_large_image' />
        <meta name="twitter:site" content="@ParasHQ" />
        <meta name='twitter:url' content='https://alpha.paras.id' />
        <meta name='twitter:title' content={`${router.query.id} | Profile`} />
        <meta name='twitter:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
        <meta name='twitter:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />

        <meta property='og:type' content='website' />
        <meta property='og:title' content={`${router.query.id} | Profile`} />
        <meta property='og:site_name' content={`${router.query.id} | Profile`} />
        <meta property='og:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
        <meta property='og:url' content='https://alpha.paras.id' />
        <meta property='og:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
      </Head>
      < ProfileScreen id={router.query.id} />
    </Fragment>
  )
}

export default withRedux(UserPage)