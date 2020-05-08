import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { withRedux } from '../../lib/redux'
import PostScreen from '../../screens/PostScreen'

const PostDetailPage = () => {
  const router = useRouter()
  const [id, setId] = useState(null)

  useEffect(() => {
    if(router && router.query.id) {
      setId(router.query.id)
    }
  }, [router])

  return (
    <PostScreen id={id} />
  )
}

export default withRedux(PostDetailPage)