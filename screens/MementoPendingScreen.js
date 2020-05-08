import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import axios from 'axios'
import MementoPending from "../components/MementoPending"

const MementoPendingScreen = ({ id }) => {
  const [postList, setPostList] = useState([])
  
  useEffect(() => {
    const getData = async () => {
      const respBlock = await axios.get(`http://localhost:3004/blocks/${id}`)
      const respPostList = await axios.get(`http://localhost:3004/posts?blockId=${id}&status=pending&_sort=createdAt&_order=desc`)
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
    if(id) {
      getData()
    }
  }, [id])

  return (
    <MementoPending mementoId={id} postList={postList} setPostList={setPostList} />
  )
}

export default MementoPendingScreen