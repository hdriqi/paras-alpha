import React from 'react'
import { useRouter } from 'next/router'
import PostEditScreen from 'screens/PostEditScreen'

const PostEditPage = () => {
  const router = useRouter()

  return (
    <PostEditScreen id={router.query.id} />
  )
}

export default PostEditPage