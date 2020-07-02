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
        <meta name='twitter:title' content={`${router.query.id} | Profile`} />
        <meta property='og:title' content={`${router.query.id} | Profile`} />
        <meta property='og:site_name' content={`${router.query.id} | Profile`} />
      </Head>
      < ProfileScreen id={router.query.id} />
    </Fragment>
  )
}

export default withRedux(UserPage)