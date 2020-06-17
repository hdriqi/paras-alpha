import ProfileMemento from 'components/Profile/Memento'
import { useEffect, useState } from 'react'
import axios from 'axios'

const ProfileMementoScreen = ({ id }) => {
  const [mementoList, setMementolist] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_URL}/mementos?owner=${id}&_limit=100`)
        const list = response.data.data

        setMementolist(list)
      } catch (err) {
        console.log(err)
      }
    }
    if (id) {
      console.log('get post data')
      getData()
    }
  }, [id])

  return (
    <ProfileMemento mementoList={mementoList} />
  )
}

export default ProfileMementoScreen