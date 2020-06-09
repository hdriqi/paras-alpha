import '@evius/pure-react-carousel/dist/react-carousel.es.css';
import '../css/main.css'
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