import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-dropdown/style.css'
import '../css/main.css'
import '@evius/pure-react-carousel/dist/react-carousel.es.css';
import ScrollPositionProvider from '../components/ScrollPositionProvider'
import PageManager from '../components/PageManager'
import Layout from '../components/Layout'

export default function MyApp({ Component, pageProps }) {
  return <ScrollPositionProvider>
    <Layout>
      <PageManager>
        <Component {...pageProps} />
      </PageManager>
    </Layout>
  </ScrollPositionProvider>
}