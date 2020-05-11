import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import BlockPage from '../../components/Memento'
import { useRouter } from 'next/router'
import MementoScreen from '../../screens/MementoScreen'

const MementoPage = () => {
  const router = useRouter()

  return (
    <MementoScreen id={router.query.id} />
  )
}

export default MementoPage