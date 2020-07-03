import React from 'react'
import ProfileScreen from '../screens/ProfileScreen'
import Head from 'next/head'
import axios from 'axios'

const ipfsToHttp = (data) => {
  let url = ''
  if (data && data.type === 'ipfs') {
    url = `https://ipfs-gateway.paras.id/ipfs/${data.url}`
  }
  else if (typeof data === 'string') {
    url = data
  }
  return url
}

const UserPage = ({ id, user }) => {
  const imgUrl = user && ipfsToHttp(user.imgAvatar)

  return (
    <div>
      {
        user ? (
          <Head>
            <title>{`${id} | profile`}</title>
            <meta name="description" content={user.desc} />

            <meta name='twitter:title' content={`${id} | profile`} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name="twitter:site" content="@ParasHQ" />
            <meta name='twitter:url' content='https://alpha.paras.id' />
            <meta name='twitter:description' content={user.desc} />
            <meta name='twitter:image' content={imgUrl} />
            <meta property='og:type' content='website' />
            <meta property='og:title' content={`${id} | profile`} />
            <meta property='og:site_name' content={`${id} | profile`} />
            <meta property='og:description' content={user.desc} />
            <meta property='og:url' content='https://alpha.paras.id' />
            <meta property='og:image' content={imgUrl} />
          </Head>
        ) : (
            <Head>
              <title>User not found</title>

              <meta name='twitter:title' content="User not found" />
              <meta name='twitter:card' content='summary_large_image' />
              <meta name="twitter:site" content="@ParasHQ" />
              <meta name='twitter:url' content='https://alpha.paras.id' />
              <meta name='twitter:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
              <meta name='twitter:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
              <meta property='og:type' content='website' />
              <meta property='og:title' content="User not found" />
              <meta property='og:site_name' content="User not found" />
              <meta property='og:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
              <meta property='og:url' content='https://alpha.paras.id' />
              <meta property='og:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
            </Head>
          )
      }
      <ProfileScreen id={id} />
    </div>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  const response = await axios.get(`${process.env.BASE_URL}/users?id=${id}`)
  const user = response.data.data[0]
  return {
    props: {
      id: context.params.id,
      user: user || null
    },
  }
}

export default UserPage
