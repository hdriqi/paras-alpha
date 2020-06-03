import { useState, useEffect } from 'react'
import { readFileAsUrl } from '../../lib/utils'

let cropper = null

const NewPostImage = ({ left, right, input = {} }) => {
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    const readImg = async () => {
      const imgUrl = await readFileAsUrl(input || {})
      setImgUrl(imgUrl)
    }
    readImg()
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && imgUrl.length > 0) {
      const Croppie = require('croppie')
      cropper = new Croppie(document.getElementById('new-img'), {
        boundary: { width: `100%`, height: 256 },
        viewport: { width: 200, height: 200, type: 'square' }
      })
    }
  }, [imgUrl])

  const _right = async (e) => {
    e.preventDefault()

    const newFile = await cropper.result({
      type: 'blob',
      size: {
        width: 1080,
        height: 1080
      }
    })
    newFile.lastModifiedDate = new Date()
    newFile.name = `${Math.random().toString(36).substr(2, 9)}.png`
    const newImg = await readFileAsUrl(newFile)

    right({
      type: 'img',
      body: newImg,
      payload: {
        imgFile: newFile,
        imgUrl: newImg
      }
    })
  }

  const _left = () => {
    left()
  }

  return (
    <div className="fixed inset-0 z-50" style={{
      backgroundColor: `rgba(0,0,0,0.8)`
    }}>
      <div className="max-w-sm m-auto p-4 flex items-center h-full w-full">
        <div className="bg-dark-1 w-full rounded-md overflow-hidden">
          <div className="flex justify-between items-center w-full h-12 bg-dark-4 px-2">
            <div className="w-8 text-white">
              <svg onClick={e => _left(e)} width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z" fill="white" />
              </svg>
            </div>
            <div className="flex-auto text-white overflow-hidden px-2">Add Image</div>
            <div className="w-8 text-white">
              <svg onClick={e => _right(e)} className="ml-auto" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="#E13128" />
              </svg>
            </div>
          </div>
          <div className="w-full">
            <img id="new-img" src={imgUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPostImage