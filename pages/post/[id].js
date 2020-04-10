import React, { useEffect, useState } from 'react'
import Layout from '../../components/layout'
import PostDetail from '../../components/postDetail'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { withRedux } from '../../lib/redux'
import { addPostList } from '../../actions/me'

const PostDetailPage = () => {
  const router = useRouter()

  const [id, setId] = useState(null)
  const [post, setPost] = useState({})
  const [commentList, setCommentList] = useState([])

  useEffect(() => {
    const getData = async () => {
      try {
        const resPost = await axios.get(`http://localhost:3004/posts/${id}`)
        const post = resPost.data

        const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
        const resBlock = await axios.get(`http://localhost:3004/blocks/${post.blockId}`)
        post.user = resUser.data
        post.block = resBlock.data

        const resCommentList = await axios.get(`http://localhost:3004/comments?postId=${id}`)
        const commentList = await Promise.all(resCommentList.data.map(comment => {
          return new Promise(async (resolve) => {
            const resUser = await axios.get(`http://localhost:3004/users/${comment.userId}`)
            comment.user = resUser.data
            resolve(comment)
          })
        }))

        setPost(post)
        setCommentList(commentList)
      } catch (err) {
        console.log(err)
      }
    }
    if(id) {
      getData()
    }
  }, [id])

  useEffect(() => {
    if(router && router.query) {
      setId(router.query.id)
    }
  }, [router])

  return (
    <Layout>
      <PostDetail post={post} commentList={commentList} />
    </Layout>
  )
}

// export async function getServerSideProps({ params }) {
//   // Fetch data from external API
//   // const res = await fetch(`https://.../data`)
//   // const data = await res.json()
//   const postList = [
//     {
//       id: '1234',
//       block: {
//         name: 'Sunda Empire'
//       },
//       text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
//       imgList: [
//         {
//           url: `https://images.pexels.com/photos/3664632/pexels-photo-3664632.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
//         },
//         {
//           url: `https://images.pexels.com/photos/3467149/pexels-photo-3467149.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
//         }
//       ],
//       author: {
//         username: 'ranggasasana',
//         avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
//       },
//       createdAt: '2020-04-04T10:14:42.399Z'
//     },
//     {
//       id: '1235',
//       block: {
//         name: 'Sunda Empire'
//       },
//       text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
//       imgList: [
        
//       ],
//       author: {
//         username: 'ranggasasana',
//         avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
//       },
//       createdAt: '2020-04-04T10:14:42.399Z'
//     }
//   ]

//   const commentList = [
//     {
//       id: '1232n19',
//       postId: '1234',
//       author: {
//         username: 'ranggasasana',
//         avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
//       },
//       text: 'Hello darkness my old friends!',
//       createdAt: '2020-04-04T10:14:42.399Z'
//     },
//     {
//       id: '4d6gb8',
//       postId: '1234',
//       author: {
//         username: 'ranggasasana',
//         avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
//       },
//       text: 'I\'ve come to talk with you again...',
//       createdAt: '2020-04-04T10:14:42.399Z'
//     }
//   ]

//   const post = postList.find(post => post.id == params.id)

//   return { props: { post: post, commentList: commentList } }
// }

export default withRedux(PostDetailPage)