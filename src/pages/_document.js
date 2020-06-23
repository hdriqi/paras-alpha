import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charset='utf-8' />
          <meta name="theme-color" content="#33333" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

          <meta name='application-name' content='Paras' />
          <meta http-equiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
          <meta name='description' content='Decentralized collective memory' />
          <meta name='keywords' content='decentralized social media,blockchain social media' />
          <title>Paras</title>

          <link rel='manifest' href='/static/manifest.json' />
          <link href='/favicon.ico' rel='icon' type='image/png' sizes='16x16' />
          <link rel='apple-touch-icon' href='/apple-icon.png'></link>

          <script async src="https://stat.paras.id/tracker.js" data-ackee-server="https://stat.paras.id" data-ackee-domain-id="fef11e6a-3d7c-4ede-bb9d-64f7b6ef32dc"></script>

          {/* <meta name='twitter:card' content='summary' />
          <meta name='twitter:url' content='https://yourdomain.com' />
          <meta name='twitter:title' content='PWA App' />
          <meta name='twitter:description' content='Best PWA App in the world' />
          <meta name='twitter:image' content='https://yourdomain.com/static/icons/android-chrome-192x192.png' />
          <meta name='twitter:creator' content='@ParasHQ' />
          <meta property='og:type' content='website' />
          <meta property='og:title' content='PWA App' />
          <meta property='og:description' content='Best PWA App in the world' />
          <meta property='og:site_name' content='PWA App' />
          <meta property='og:url' content='https://yourdomain.com' />
          <meta property='og:image' content='https://yourdomain.com/static/icons/apple-touch-icon.png' /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}