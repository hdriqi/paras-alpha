import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withRedux } from '../../lib/redux'
import PostScreen from '../../screens/PostScreen'
import Head from 'next/head'

const PostDetailPage = () => {
  const router = useRouter()
  const [id, setId] = useState(null)

  useEffect(() => {
    if (router && router.query.id) {
      setId(router.query.id)
    }
  }, [router])

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
      <PostScreen id={id} />
    </div>
  )
}

export default withRedux(PostDetailPage)