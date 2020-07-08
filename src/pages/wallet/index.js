import WalletScreen from 'screens/WalletScreen'
import Head from 'next/head'

const WalletPage = () => {
  return (
    <div>
      <Head>
        <title>Wallet - Paras</title>
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
      <WalletScreen />
    </div>
  )
}

export default WalletPage