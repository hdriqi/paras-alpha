import { useState, useEffect } from 'react'

import NewPostCreate from './Create'
import NavTop from '../NavTop'
import Pop from '../Pop'
import { useDispatch, useSelector } from 'react-redux'
import { compressImg } from 'lib/utils'
import ipfs from 'lib/ipfs'
import axios from 'axios'
import near from 'lib/near'
import { useRouter } from 'next/router'
import { updatePost } from 'actions/entities'
import { RotateSpinLoader } from 'react-css-loaders'

const EditPost = ({ post = {} }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const me = useSelector(state => state.me.profile)
  const [content, setContent] = useState(post.contentList)
  const [chosenMemento, setChosenMemento] = useState(post.memento)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (me.id !== post.owner) {
      router.replace('/post/[id]', `/post/${post.id}`)
    }
  }, [me, post])

  const _submit = async () => {
    setIsSubmitting(true)
    const postContentList = content.map(content => {
      return new Promise(async (resolve, reject) => {
        let newContent = {
          type: content.type
        }
        if (content.type === 'text') {
          if (content.payload) {
            newContent.body = content.payload.raw
          }
          else {
            newContent.body = content.body
          }
        }
        else if (content.type === 'url') {
          if (content.payload) {
            newContent.body = content.payload
            try {
              const response = await axios.get(content.payload.img, {
                responseType: 'blob'
              })
              const img = await compressImg(response.data)
              for await (const file of ipfs.client.add([{
                content: img
              }])) {
                newContent.body.img = {
                  url: file.path,
                  type: 'ipfs'
                }
              }
            } catch (err) {
              console.log(err)
            } finally {
              newContent.body = JSON.stringify(newContent.body)
            }
          }
          else {
            newContent.body = content.body
          }
        }
        else if (content.type === 'img') {
          if (content.payload) {
            const img = await compressImg(content.payload.imgFile)
            for await (const file of ipfs.client.add([{
              content: img
            }])) {
              newContent.body = {
                url: file.path,
                type: 'ipfs'
              }
              newContent.body = JSON.stringify(newContent.body)
            }
          }
          else {
            newContent.body = content.body
          }
        }
        else if (content.type === 'blank') {
          newContent.body = ''
        }
        resolve(newContent)
      })
    })

    const newContentList = await Promise.all(postContentList)

    const payload = {
      id: post.id,
      contentList: newContentList,
      mementoId: chosenMemento.id
    }
    const newData = await near.contract.editPost(payload)
    const updatedData = {
      ...post,
      ...newData
    }
    if (newData) {
      dispatch(updatePost(updatedData.id, updatedData))
    }
    setIsSubmitting(false)

    router.back()
  }

  const _validateSubmit = () => {
    if (chosenMemento !== null) {
      const idx = content.findIndex(c => c.type !== 'blank')
      return idx > -1 && true
    }
    return false
  }

  return (
    <div className="bg-dark-0 min-h-screen pb-4">
      <NavTop
        left={
          <Pop>
            <button className="flex items-center">
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
              </svg>
            </button>
          </Pop>
        }
        center={
          <h3 className="text-lg font-bold text-white px-2">Edit Post</h3>
        }
        right={
          isSubmitting ? (
            <RotateSpinLoader style={{
              marginLeft: `auto`,
              marginRight: 0
            }} color="#e13128" size={2.4} />
          ) : (
              <button disabled={!_validateSubmit()} onClick={_submit}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                  <circle cx="16" cy="16" r="16" fill="#E13128" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
                </svg>
              </button>
            )
        }
      />
      <NewPostCreate content={content} setContent={setContent} chosenMemento={chosenMemento} setChosenMemento={setChosenMemento} />
    </div>
  )
}

export default EditPost