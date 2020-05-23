import React from 'react'
import { useRouter } from 'next/router'
import PostMementoScreen from '../../../screens/PostMementoScreen'

const PostMementoPage = () => {
  const router = useRouter()

  return (
    <PostMementoScreen id={router.query.id} />
  )
}

export default PostMementoPage