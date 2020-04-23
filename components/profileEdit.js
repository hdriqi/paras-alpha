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
  const [currImgUrl, setCurrImgUrl] = useState('')
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
          <div className="m-auto relative w-20 h-20">
            <input className="absolute cursor-pointer inset-0 opacity-0 w-full" type="file" accept="image/*" onClick={(e) => e.target.value = null}  onChange={(e) => _changeImg(e.target.files)} />
            <img onClick={_ => _changeImg()} className="w-full h-full rounded-full overflow-hidden object-cover" src={imgUrl} />
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