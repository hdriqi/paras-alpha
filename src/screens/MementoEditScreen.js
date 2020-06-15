import { useEffect, useState } from 'react'
import MementoEdit from '../components/Memento/Edit'
import axios from 'axios'

const MementoEditScreen = ({ id, memento = null }) => {
  const [localMemento, setLocalMemento] = useState(memento)

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(`http://localhost:9090/mementos?id=${id}`)
      const memento = response.data.data[0]

      setLocalMemento(memento)
    }
    if(id && !localMemento) {
      getData()
    }
  }, [id])

  return (
    <MementoEdit memento={localMemento} />
  )
}

export default MementoEditScreen