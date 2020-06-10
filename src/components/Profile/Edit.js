import { withRedux } from '../../lib/redux'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'

import near from '../../lib/near'
import { setLoading } from '../../actions/ui'
import Image from '../Image'
import RichText from '../Input/RichText'
import NavTop from 'components/NavTop'
import Scrollbars from 'react-custom-scrollbars'
import Select from 'components/Input/Select'
import Alert from 'components/Utils/Alert'
import Pop from 'components/Pop'
import initials from 'initials'
import { dataURItoBlob } from 'lib/utils'
import ipfs from 'lib/ipfs'
import Push from '../Push'
import NewPostImage from 'components/NewPost/Image'
import { useRouter } from 'next/router'

const ProfileEdit = ({ me }) => {
  const dispatch = useDispatch()
  const bodyRef = useRef(null)
  const inputImgRef = useRef(null)
  const descRef = useRef(null)

  const router = useRouter()
  const [bio, setBio] = useState('')
  const [descBackground, setDescBackground] = useState('bg-dark-2')
  const [showImgCrop, setShowImgCrop] = useState(false)
  const [img, setImg] = useState({})
  const [imgFile, setImgFile] = useState({})

  useEffect(() => {
    if (me.id) {
      setImg(me.imgAvatar)
      setBio(me.bio)
    }
  }, [me])

  const _validateSubmit = () => {
    if (
      (bio.length <= 150)) {
      return true
    }
    return false
  }

  const _submit = async (e) => {
    e.preventDefault()

    dispatch(setLoading(true, 'Updating profile...'))
    let img = me.imgAvatar
    if (imgFile.size > 0) {
      for await (const file of ipfs.client.add([{
        content: imgFile
      }])) {
        img = {
          url: file.path,
          type: 'ipfs'
        }
      }
    }

    const newData = {
      imgAvatar: img,
      bio: bio
    }
    
    const newMe = await near.contract.updateUser(newData)
    console.log(newMe)
    dispatch(setLoading(false))
    dispatch(setProfile(newProfile))
    router.back()
  }

  const _descOnFocus = (e) => {
    setDescBackground('bg-dark-12')
  }
  const _descOnBlur = () => {
    setDescBackground('bg-dark-2')
  }

  const _addImg = (e) => {
    setShowImgCrop(true)
    setImgFile(e.target.files[0])
  }

  return (
    <div id="new-memento" className="bg-dark-0 min-h-screen">
      <input ref={inputImgRef} type="file" accept="image/*" onClick={(e) => { e.target.value = null }} onChange={e => _addImg(e)} className="hidden" />
      {
        showImgCrop && (
          <NewPostImage
            input={imgFile}
            left={_ => {
              setImgFile({})
              setShowImgCrop(false)
            }}
            right={result => {
              setImgFile(result.payload.imgFile)
              setImg(result.payload.imgUrl)
              setShowImgCrop(false)
            }}
            type='circle'
            size={{
              width: 512,
              height: 512
            }}
          />
        )
      }
      <NavTop
        left={
          <Pop>
            <button>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.9991 13.0607L8.77941 16.2804L7.71875 15.2197L10.9384 12.0001L7.71875 8.78039L8.77941 7.71973L11.9991 10.9394L15.2187 7.71973L16.2794 8.78039L13.0597 12.0001L16.2794 15.2197L15.2187 16.2804L11.9991 13.0607V13.0607Z" fill="white" />
              </svg>
            </button>
          </Pop>
        }
        center={
          <h3 className="text-lg font-bold text-white px-2">Update Profile</h3>
        }
        right={
          <button disabled={!_validateSubmit()} onClick={_submit}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
              <circle cx="16" cy="16" r="16" fill="#E13128" />
              <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
            </svg>
          </button>
        }
      />
      <div className="my-4">
        <div className="px-4">
          <div className="mt-4">
            <div ref={descRef} className="flex justify-between">
              <label className="block text-sm pb-1 font-semibold text-white">Avatar</label>
            </div>
            <div className="h-40 w-40 rounded-md relative overflow-hidden cursor-pointer">
              <div className="absolute inset-0 flex items-center justify-center opacity-60 bg-dark-0">
                <svg onClick={_ => inputImgRef.current.click()} className="cursor-pointer" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#E13128" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.8576 10.328C11.9155 10.2474 11.9799 10.1488 12.062 10.0158C12.092 9.96718 12.1738 9.83227 12.2347 9.7318L12.2347 9.73171L12.3033 9.6187C12.9816 8.50923 13.4746 8 14.3636 8H17.6364C18.5254 8 19.0184 8.50923 19.6967 9.6187L19.7654 9.7318C19.8262 9.83226 19.908 9.96718 19.938 10.0158C20.0201 10.1488 20.0844 10.2474 20.1425 10.328C20.1807 10.3812 20.214 10.4234 20.2413 10.4545H22.5455C23.9011 10.4545 25 11.5535 25 12.9091V20.2727C25 21.6284 23.9011 22.7273 22.5455 22.7273H9.45455C8.09894 22.7273 7 21.6284 7 20.2727V12.9091C7 11.5535 8.09894 10.4545 9.45455 10.4545H11.7587C11.7859 10.4234 11.8193 10.3812 11.8576 10.328ZM9.45455 12.0909C9.00268 12.0909 8.63636 12.4572 8.63636 12.9091V20.2727C8.63636 20.7246 9.00268 21.0909 9.45455 21.0909H22.5455C22.9973 21.0909 23.3636 20.7246 23.3636 20.2727V12.9091C23.3636 12.4572 22.9973 12.0909 22.5455 12.0909H20.0909C19.5474 12.0909 19.1808 11.7934 18.8141 11.2836C18.7297 11.1663 18.6461 11.0382 18.5454 10.8752C18.511 10.8193 18.4215 10.6717 18.3601 10.5703L18.3006 10.4722C17.9305 9.86686 17.7073 9.63636 17.6364 9.63636H14.3636C14.2927 9.63636 14.0695 9.86686 13.6994 10.4722L13.6399 10.5703L13.6396 10.5709C13.5782 10.6722 13.4889 10.8194 13.4545 10.8752C13.3539 11.0382 13.2703 11.1663 13.186 11.2836C12.8192 11.7934 12.4526 12.0909 11.9091 12.0909H9.45455ZM22.5455 13.7273C22.5455 14.1792 22.1792 14.5455 21.7273 14.5455C21.2754 14.5455 20.9091 14.1792 20.9091 13.7273C20.9091 13.2754 21.2754 12.9091 21.7273 12.9091C22.1792 12.9091 22.5455 13.2754 22.5455 13.7273ZM11.9091 16.1818C11.9091 18.4411 13.7407 20.2727 16 20.2727C18.2593 20.2727 20.0909 18.4411 20.0909 16.1818C20.0909 13.9225 18.2593 12.0909 16 12.0909C13.7407 12.0909 11.9091 13.9225 11.9091 16.1818ZM18.4545 16.1818C18.4545 17.5375 17.3556 18.6364 16 18.6364C14.6444 18.6364 13.5455 17.5375 13.5455 16.1818C13.5455 14.8262 14.6444 13.7273 16 13.7273C17.3556 13.7273 18.4545 14.8262 18.4545 16.1818Z" fill="white" />
                </svg>
              </div>
              <Image data={img} />
            </div>
          </div>
          <div className="mt-4">
            <div ref={descRef} className="flex justify-between">
              <label className="block text-sm pb-1 font-semibold text-white">Bio</label>
              <p className={`${bio.length > 150 ? 'text-red-600 font-bold' : 'text-black-5'} text-sm`}>{bio.length}/150</p>
            </div>
            <div className={`${descBackground} rounded-md h-32 p-2`}>
              <Scrollbars>
                <RichText
                  inputRef={bodyRef}
                  text={bio}
                  setText={setBio}
                  placeholder="Memento description"
                  className="w-full"
                  suggestionsPortalHost={descRef.current}
                  onFocus={_descOnFocus}
                  onBlur={_descOnBlur}
                  style={{
                    suggestions: {
                      maxWidth: descRef && descRef.current ? `${descRef.current.clientWidth}px` : '100%'
                    }
                  }}
                />
              </Scrollbars>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRedux(ProfileEdit)