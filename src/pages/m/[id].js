import React from 'react'
import { useRouter } from 'next/router'
import MementoScreen from '../../screens/MementoScreen'
import Head from 'next/head'

const MementoPage = () => {
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>{`${router.query.id} | Memento`}</title>
        <meta name="description" content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />

        <meta name='twitter:title' content={`${router.query.id} | Memento`} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name="twitter:site" content="@ParasHQ" />
        <meta name='twitter:url' content='https://alpha.paras.id' />
        <meta name='twitter:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
        <meta name='twitter:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
        <meta property='og:type' content='website' />
        <meta property='og:title' content={`${router.query.id} | Memento`} />
        <meta property='og:site_name' content={`${router.query.id} | Memento`} />
        <meta property='og:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
        <meta property='og:url' content='https://alpha.paras.id' />
        <meta property='og:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
      </Head>
      <MementoScreen id={router.query.id} />
    </div>
  )
}

export default MementoPage