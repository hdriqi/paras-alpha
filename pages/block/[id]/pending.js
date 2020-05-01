import Layout from "../../../components/layout"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from 'axios'
import Post from '../../../components/post'

const BlockPending = () => {
  const router = useRouter()
  const [postList, setPostList] = useState([])
  
  const _close = () => {
    router.back()
  }

  const _accept = async (post, idx) => {
    const newData = {
      status: 'published',
      body: post.body,
      bodyRaw: post.bodyRaw,
      imgList: post.imgList,
      userId: post.userId,
      createdAt: post.createdAt,
      updatedAt: new Date().toISOString(),
    }
    await axios.put(`http://localhost:3004/posts/${post.id}`, newData)
    const newPostList = [...postList]
    newPostList.splice(idx, 1)
    setPostList(newPostList)
  }

  const _decline = async (post, idx) => {
    await axios.delete(`http://localhost:3004/posts/${post.id}`)
    const newPostList = [...postList]
    newPostList.splice(idx, 1)
    setPostList(newPostList)
  }

  useEffect(() => {
    const getData = async () => {
      const respBlock = await axios.get(`http://localhost:3004/blocks/${router.query.id}`)
      const respPostList = await axios.get(`http://localhost:3004/posts?blockId=${router.query.id}&status=pending&_sort=createdAt&_order=desc`)
      const postList = await Promise.all(respPostList.data.map(post => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${post.userId}`)
          post.user = resUser.data
          post.block = respBlock.data

          resolve(post)
        })
      }))
      setPostList(postList)
    }
    if(router.query.id) {
      getData()
    }
  }, [router])

  return (
    <Layout>
      <div className="bg-white-1 min-h-screen">
        <div className="pb-12">
          <div className="fixed bg-white shadow-subtle top-0 left-0 right-0 h-12 px-4 z-20">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute left-0">
                <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Pending Post</h3>
              </div>
            </div>
          </div>
        </div>
        <div>
          {
            postList && postList.map((post, idx) => {
              return (
                <div className="mt-6 shadow-subtle " key={post.id}>
                  <div className="flex justify-around border-b border-black-6">
                    <div className="w-1/2">
                      <button onClick={_ => _accept(post, idx)} className="w-full text-lg font-semibold py-2 px-4 bg-black-1 text-white">Accept</button>
                    </div>
                    <div className="w-1/2">
                    <button onClick={_ => _decline(post, idx)}  className="w-full text-lg font-semibold py-2 px-4 bg-white">Denied</button>
                    </div>
                  </div>
                  <Post post={post} />
                </div>
              )
            })
          }
        </div>
      </div>
    </Layout>
  )
}

export default BlockPending