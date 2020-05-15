import { useState, useEffect, useRef } from "react"
import { withRedux } from "../lib/redux"
import { useSelector, useDispatch } from "react-redux"
import { toggleImageCrop } from "../actions/ui"
import { readFileAsUrl } from "../lib/utils"

let cropper = null

const ImageCrop = ({ imgUrl, setImgUrl }) => {
  const showImageCrop = useSelector(state => state.ui.showImageCrop)
  const profile = useSelector(state => state.me.profile)
  const dispatch = useDispatch()
  
  const _submit = async (e) => {
    e.preventDefault()

    const result = await cropper.result({ 
			type: 'blob',
			size: {
				width: 512,
				height: 512
			}
		})
		result.lastModifiedDate = new Date()
		result.name = `${Math.random().toString(36).substr(2, 9)}.png`
    const newImg = await readFileAsUrl(result)
    setImgUrl(newImg)

    dispatch(toggleImageCrop(false))
  }

  const _cancel = () => {
    setImgUrl(profile.avatarUrl)
    dispatch(toggleImageCrop(false))
  }

  useEffect(() => {
		if(typeof window !== 'undefined' && showImageCrop) {
			const Croppie  = require('croppie')
			cropper = new Croppie(document.getElementById('img'), {
				boundary: { width: `100%`, height: 256 },
				viewport: { width: 200, height: 200, type: 'circle' }
      })
		}
	}, [imgUrl, showImageCrop])

  return (
    showImageCrop ? (
      <div className="fixed bg-white inset-0 z-30 px-4">
        <div className="pt-12">
          <div className="fixed top-0 left-0 right-0 h-12 px-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute left-0">
                <svg onClick={e => _cancel()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Edit Image</h3>
              </div>
              <div className="absolute right-0">
                <h3 onClick={e => _submit(e)} className="text-2xl font-bold text-black-1 tracking-tighter">Save</h3>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <div>
                <div className="w-full">
                  <img className="w-10 h-10" id="img" src={imgUrl} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      null
    )
  ) 
}

export default withRedux(ImageCrop)