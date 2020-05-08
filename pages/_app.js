import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-dropdown/style.css'
import '../css/main.css'
import ScrollPositionProvider from '../components/ScrollPositionProvider'
import PageManager from '../components/PageManager'
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }) {
  return <ScrollPositionProvider>
    <PageManager>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </PageManager>
  </ScrollPositionProvider>
}