import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta charSet='utf-8' />
          <meta name="theme-color" content="#33333" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

          <meta name='application-name' content='Paras' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport' content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no' />
          <meta name='keywords' content='decentralized social media,blockchain social media' />

          <link rel='manifest' href='/manifest.json' />
          <link href='/favicon.ico' rel='icon' type='image/png' sizes='16x16' />
          <link rel='apple-touch-icon' href='/favicon.ico'></link>

          <script async src="https://stat.paras.id/tracker.js" data-ackee-server="https://stat.paras.id" data-ackee-domain-id="889b9dbd-b828-43f8-a339-420b34b75d39"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}