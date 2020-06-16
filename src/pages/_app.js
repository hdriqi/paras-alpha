import '@evius/pure-react-carousel/dist/react-carousel.es.css'
import '../css/main.css'
import ScrollPositionProvider from '../components/ScrollPositionProvider'
import PageManager from '../components/PageManager'
import Layout from '../components/Layout'
import NotifyProvider from 'components/Utils/NotifyProvider'

export default function MyApp({ Component, pageProps }) {
  return <ScrollPositionProvider>
    <NotifyProvider>
      <Layout>
        <PageManager>
          <Component {...pageProps} />
        </PageManager>
      </Layout>
    </NotifyProvider>
  </ScrollPositionProvider>
}