import { useEffect, useState } from 'react'
import MementoEdit from '../components/Memento/Edit'
import near from '../lib/near'

const MementoEditScreen = ({ id }) => {
  const [memento, setMemento] = useState(null)

  useEffect(() => {
    const getData = async () => {
      const memento = await near.contract.getMementoById({
        id: id
      })

      setMemento(memento)
    }
    if(id && !memento) {
      console.log('get memento data')
      getData()
    }
  }, [id])

  return (
    <MementoEdit memento={memento} />
  )
}

export default MementoEditScreen