import React, { Fragment } from 'react'
import { useRouter } from 'next/router'
import MementoScreen from '../../screens/MementoScreen'
import Head from 'next/head'

const MementoPage = () => {
  const router = useRouter()

  return (
    <Fragment>
      <Head>
        <meta name='twitter:title' content={`${router.query.id} | Memento`} />
        <meta property='og:title' content={`${router.query.id} | Memento`} />
        <meta property='og:site_name' content={`${router.query.id} | Memento`} />
      </Head>
      <MementoScreen id={router.query.id} />
    </Fragment>
  )
}

export default MementoPage