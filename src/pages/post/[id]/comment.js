import React from 'react'
import { useRouter } from 'next/router'
import PostCommentScreen from '../../../screens/PostCommentScreen'

const PostCommentPage = () => {
  const router = useRouter()

  return (
    <PostCommentScreen id={router.query.id} />
  )
}

export default PostCommentPage