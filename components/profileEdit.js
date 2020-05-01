import { useRouter } from "next/router"
import { useState, useRef, useEffect } from "react"
import { Mention, MentionsInput } from "react-mentions"
import axios from 'axios'
import { useDispatch } from "react-redux"
import { withRedux } from "../lib/redux"
import { setProfile } from "../actions/me"
import ImageCrop from "./imageCrop"
import { toggleImageCrop } from "../actions/ui"
import { readFileAsUrl } from "../lib/utils"

const ProfileEdit = ({ profile }) => {
  const router = useRouter()
  const bodyRef = useRef(null)

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [imgUrl, setImgUrl] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if(profile.id) {
      setUsername(profile.username)
      setBio(profile.bioRaw)
      setImgUrl(profile.avatarUrl)
    }
  }, [profile])

  const _changeImg = async (files) => {
    if(files.length > 0) {
      const imgUrl = await readFileAsUrl(files[0])
			setImgUrl(imgUrl)
      dispatch(toggleImageCrop(true))
		}
  }

  const _submit = async (e) => {
    e.preventDefault()

    try {
      const newProfile = {
        ...profile,
        ...{
          username: username,
          avatarUrl: imgUrl,
          bio: bodyRef.current.value || '',
          bioRaw: bio || ''
        }
      }
      const response = await axios.put(`http://localhost:3004/users/${profile.id}`, newProfile)
      dispatch(setProfile(response.data))
    } catch (err) {
      console.log(err)
    }

    _close()
  }

  const _close = () => {
    router.back()
  }

  const _getUsers = async (query, callback) => {
    if (!query) return
    const response = await axios.get(`http://localhost:3004/users?username_like=${query}`)
    const list = response.data.map(user => ({ display: `@${user.username}`, id: user.id }))
    callback(list)
  }

  return (
    <div className="min-h-screen">
      <div className="pb-16">
        <div className="fixed bg-white shadow-subtle top-0 left-0 right-0 h-12 px-4 z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-0">
              <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Edit Profile</h3>
            </div>
            <div className="absolute right-0">
              <h3 onClick={e => _submit(e)} className="text-2xl font-bold text-black-1 tracking-tighter">Save</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6">
        <div className="px-4">
          <div className="m-auto relative w-20 h-20 rounded-full overflow-hidden">
            <input className="absolute cursor-pointer inset-0 opacity-0 w-full z-10" type="file" accept="image/*" onClick={(e) => e.target.value = null}  onChange={(e) => _changeImg(e.target.files)} />
            <div className="absolute inset-0 flex items-center opacity-75 bg-black-1">
              <svg className="m-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.93702 5.84538C7.00787 5.74688 7.08656 5.62631 7.18689 5.46372C7.22356 5.40431 7.32355 5.23934 7.39799 5.11653L7.4818 4.97841C8.31079 3.62239 8.91339 3 10 3H15V5H10C9.91327 5 9.6405 5.28172 9.1882 6.02159L9.11542 6.14154L9.11524 6.14183C9.04019 6.26566 8.93096 6.44589 8.88887 6.51409C8.76592 6.71332 8.66375 6.86988 8.56061 7.01326C8.11237 7.63641 7.66434 8 7 8H4C3.44772 8 3 8.44772 3 9V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V12H23V18C23 19.6569 21.6569 21 20 21H4C2.34315 21 1 19.6569 1 18V9C1 7.34315 2.34315 6 4 6H6.8162C6.84949 5.96194 6.8903 5.91033 6.93702 5.84538ZM17 8V6H19V4H21V6H23V8H21V10H19V8H17ZM12 18C9.23858 18 7 15.7614 7 13C7 10.2386 9.23858 8 12 8C14.7614 8 17 10.2386 17 13C17 15.7614 14.7614 18 12 18ZM12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13C9 14.6569 10.3431 16 12 16Z" fill="white"/>
              </svg>
            </div>
            <img onClick={_ => _changeImg()} className="w-full h-full object-cover" src={imgUrl} />
          </div>
          <div className="mt-4">
            <label>Username</label>
            <input className="mt-2 bg-gray-200 w-full p-2 rounded-md" type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div className="mt-4">
            <label>Bio</label>
            <MentionsInput className="outline-none break-words bg-gray-200 w-full rounded-md" style={{
              }} 
                style={{
                  control: {
                    fontSize: `16px`,
                    fontWeight: `500`,
                  },
                  input: {
                    margin: 0,
                    padding: `.5rem`,
                    overflow: `auto`,
                    height: `5.5rem`,
                  },
                  suggestions: {
                    list: {
                      backgroundColor: 'white',
                      border: '1px solid rgba(0,0,0,0.15)',
                      fontSize: 14,
                    },
                    item: {
                      padding: '.5rem',
                      borderBottom: '1px solid rgba(0,0,0,0.15)',
                
                      '&focused': {
                        backgroundColor: '#DFDFDF',
                      },
                    },
                  },
                }}
                placeholder="Tell us about yourself" 
                onChange={e => setBio(e.target.value)} 
                value={bio}
                allowSuggestionsAboveCursor={true}
                inputRef={bodyRef}
              >
                <Mention
                  trigger="@"
                  data={_getUsers}
                  appendSpaceOnAdd={true}
                />
              </MentionsInput>
          </div>
        </div>
      </div>
      <ImageCrop imgUrl={imgUrl} setImgUrl={setImgUrl} />
    </div>
  )
}

export default withRedux(ProfileEdit)