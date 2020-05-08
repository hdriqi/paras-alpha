import { useEffect, useState } from 'react'
import axios from 'axios'
import MementoEdit from '../components/MementoEdit'

const MementoEditScreen = ({ id, memento = {} }) => {
  const [localMemento, setLocalMemento] = useState(memento)

  useEffect(() => {
    const getData = async () => {
      const respMemento = await axios.get(`http://localhost:3004/blocks/${id}`)
      setLocalMemento(respMemento.data)
    }
    if(!memento.id && id) {
      console.log('get memento data')
      getData()
    }
  }, [id])

  return (
    <MementoEdit memento={localMemento} />
  )
}

export default MementoEditScreen