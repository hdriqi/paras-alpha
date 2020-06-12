import ProfileMementoScreen from 'screens/ProfileMementoScreen'
import { useRouter } from 'next/router'

const MeMementoPage = () => {
  const router = useRouter()

  return (
    <ProfileMementoScreen id={router.query.id} />
  )
}

export default MeMementoPage