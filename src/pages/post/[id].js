import React from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import PostScreen from '../../screens/PostScreen'
import Head from 'next/head'

const getDesc = (contentList) => {
  const hasDesc = contentList.filter(content => {
    return content.type === 'text'
  })
  if (hasDesc[0]) {
    const data = hasDesc[0].body
    return data
  }
  return null
}

const getImgUrl = (contentList) => {
  const hasThumbnailImg = contentList.filter(content => {
    return content.type === 'img'
  })
  if (hasThumbnailImg[0]) {
    const data = JSON.parse(hasThumbnailImg[0].body)
    let url = ''
    if (data && data.type === 'ipfs') {
      url = `https://ipfs-gateway.paras.id/ipfs/${data.url}`
    }
    else if (typeof data === 'string') {
      url = data
    }
    return url
  }
  return null
}

const PostDetailPage = ({ id, post }) => {
  const imgUrl = post && getImgUrl(post.contentList)
  const desc = post && getDesc(post.contentList)

  return (
    <div>
      <Head>
        <title>{`${post.owner} on Paras`}</title>
        <meta name="description" content={desc || 'Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.'} />

        <meta name='twitter:title' content={`${post.owner} on Paras`} />
        <meta name='twitter:card' content='summary' />
        <meta name="twitter:site" content="@ParasHQ" />
        <meta name='twitter:url' content='https://alpha.paras.id' />
        <meta name='twitter:description' content={desc || 'Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.'} />
        <meta name='twitter:image' content={imgUrl || 'https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png'} />
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Paras - Digital Collective Memory' />
        <meta property='og:site_name' content='Paras - Digital Collective Memory' />
        <meta property='og:description' content={desc || 'Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.'} />
        <meta property='og:url' content='https://alpha.paras.id' />
        <meta property='og:image' content={imgUrl || 'https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png'} />
      </Head>
      <PostScreen id={id} />
    </div>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  const response = await axios.get(`${process.env.BASE_URL}/posts?id=${id}`)
  const post = response.data.data[0]
  return {
    props: {
      id: context.params.id,
      post: post || null
    },
  }
}

export default PostDetailPage