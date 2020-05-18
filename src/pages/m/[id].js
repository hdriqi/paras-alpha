import React from 'react'
import { useRouter } from 'next/router'
import MementoScreen from '../../screens/MementoScreen'

const MementoPage = () => {
  const router = useRouter()

  return (
    <MementoScreen id={router.query.id} />
  )
}

export default MementoPage