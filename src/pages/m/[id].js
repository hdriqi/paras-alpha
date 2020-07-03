import React from 'react'
import MementoScreen from '../../screens/MementoScreen'
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

const MementoPage = ({ id, memento }) => {
  const imgUrl = memento && ipfsToHttp(memento.img)

  return (
    <div>
      {
        memento ? (
          <Head>
            <title>{`${id} | memento`}</title>
            <meta name="description" content={memento.desc} />

            <meta name='twitter:title' content={`${id} | memento`} />
            <meta name='twitter:card' content='summary_large_image' />
            <meta name="twitter:site" content="@ParasHQ" />
            <meta name='twitter:url' content='https://alpha.paras.id' />
            <meta name='twitter:description' content={memento.desc} />
            <meta name='twitter:image' content={imgUrl} />
            <meta property='og:type' content='website' />
            <meta property='og:title' content={`${id} | memento`} />
            <meta property='og:site_name' content={`${id} | memento`} />
            <meta property='og:description' content={memento.desc} />
            <meta property='og:url' content='https://alpha.paras.id' />
            <meta property='og:image' content={imgUrl} />
          </Head>
        ) : (
            <Head>
              <title>Memento not found</title>

              <meta name='twitter:title' content="Memento not found" />
              <meta name='twitter:card' content='summary_large_image' />
              <meta name="twitter:site" content="@ParasHQ" />
              <meta name='twitter:url' content='https://alpha.paras.id' />
              <meta name='twitter:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
              <meta name='twitter:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
              <meta property='og:type' content='website' />
              <meta property='og:title' content="Memento not found" />
              <meta property='og:site_name' content="Memento not found" />
              <meta property='og:description' content='Meet like-minded people and discover new ideas, thoughts, and creativity. Share, explore, and think independently.' />
              <meta property='og:url' content='https://alpha.paras.id' />
              <meta property='og:image' content='https://paras-media.s3-ap-southeast-1.amazonaws.com/paras-twitter-card-large.png' />
            </Head>
          )
      }
      <MementoScreen id={id} />
    </div>
  )
}

export async function getServerSideProps(context) {
  const id = context.params.id
  const response = await axios.get(`${process.env.BASE_URL}/mementos?id=${id}`)
  const memento = response.data.data[0]
  return {
    props: {
      id: context.params.id,
      memento: memento || null
    },
  }
}

export default MementoPage