import { useRouter } from 'next/router'
import MementoEditScreen from '../../../screens/MementoEditScreen'

const MementoEditPage = () => {
  const router = useRouter()
  
  return (
    <MementoEditScreen id={router.query.id} />
  )
}

export default MementoEditPage