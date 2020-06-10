import ProfileEdit from '../components/Profile/Edit'
import { useSelector } from 'react-redux'

const ProfileEditScreen = () => {
  const me = useSelector(state => state.me.profile)

  return (
    <div>
      <ProfileEdit me={me} />
    </div>
  )
}

export default ProfileEditScreen