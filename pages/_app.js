import 'react-responsive-carousel/lib/styles/carousel.min.css'
import 'react-dropdown/style.css'
import '../css/main.css'
import ScrollPositionProvider from '../components/ScrollPositionProvider'

export default function MyApp({ Component, pageProps }) {
  return <ScrollPositionProvider>
    <Component {...pageProps} />
  </ScrollPositionProvider>
}