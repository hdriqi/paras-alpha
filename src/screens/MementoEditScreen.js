import { useEffect, useState } from 'react'
import MementoEdit from '../components/Memento/Edit'
import near from '../lib/near'

const MementoEditScreen = ({ id, memento = {} }) => {
  const [localMemento, setLocalMemento] = useState(memento)

  useEffect(() => {
    const getData = async () => {
      const memento = await near.contract.getMementoById({
        id: id
      })

      setLocalMemento(memento)
    }
    if(!localMemento.id && id) {
      console.log('get memento data')
      getData()
    }
  }, [id])

  return (
    <MementoEdit memento={localMemento} />
  )
}

export default MementoEditScreen