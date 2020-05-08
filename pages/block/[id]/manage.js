import { useRouter } from 'next/router'
import MementoManageScreen from '../../../screens/MementoManageScreen'

const MementoManagePage = () => {
  const router = useRouter()

  return (
    <MementoManageScreen id={router.query.id} />
  )
}

export default MementoManagePage