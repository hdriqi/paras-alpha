import ProfileMemento from 'components/Profile/Memento'
import { useSelector } from 'react-redux'

const ProfileMementoScreen = () => {  
  const mementoList = useSelector(state => state.me.mementoList)

  return (
    <ProfileMemento mementoList={mementoList} />
  )
}

export default ProfileMementoScreen