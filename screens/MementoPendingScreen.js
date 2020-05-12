import { useEffect, useState } from "react"
import axios from 'axios'
import MementoPending from "../components/MementoPending"

const MementoPendingScreen = ({ id }) => {
  const [postList, setPostList] = useState([])
  
  useEffect(() => {
    const getData = async () => {
      const respBlock = await axios.get(`https://internal-db.dev.paras.id/blocks/${id}`)
      const respPostList = await axios.get(`https://internal-db.dev.paras.id/posts?blockId=${id}&status=pending&_sort=createdAt&_order=desc`)
      const postList = await Promise.all(respPostList.data.map(post => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`https://internal-db.dev.paras.id/users/${post.userId}`)
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