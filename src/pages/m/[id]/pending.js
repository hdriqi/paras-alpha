import { useRouter } from 'next/router'
import MementoPendingScreen from '../../../screens/MementoPendingScreen'

const MementoPendingPage = () => {
  const router = useRouter()

  return (
    <MementoPendingScreen id={router.query.id} />
  )
}

export default MementoPendingPage