import { useState, useEffect, useRef } from "react"
import { withRedux } from "../lib/redux"
import { useSelector, useDispatch } from "react-redux"
import { toggleNewPost, toggleNewBlock } from "../actions/ui"
import { readFileAsUrl } from "../lib/utils"
import { addPostList, addBlockList } from "../actions/me"
import axios from "axios"

import { MentionsInput, Mention } from 'react-mentions'

const NewPost = () => {
  const showNewPost = useSelector(state => state.ui.showNewPost)
  const blockList = useSelector(state => state.me.blockList)
  const profile = useSelector(state => state.me.profile)
  const dispatch = useDispatch()

  const bodyRef = useRef(null)
  const [chosenBlock, setChosenBlock] = useState('')
  const [postText, setPostText] = useState('')
  const [postImageList, setPostImageList] = useState([])
  const [step, setStep] = useState(1)

  const _getUsers = async (query, callback) => {
    if (!query) return
    const response = await axios.get(`http://localhost:3004/users?username_like=${query}`)
    const list = response.data.map(user => ({ display: `@${user.username}`, id: user.id }))
    callback(list)
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://localhost:3004/blocks?userId=${profile.id}`)
        dispatch(addBlockList(response.data))
      } catch (err) {
        console.log(err)
      }
    }
    if(blockList.length === 0 && profile.id) {
      getData()
    }
  }, [profile])

  const _close = () => {
    setChosenBlock('')
    setPostText('')
    setPostImageList([])
    setStep(1)
    dispatch(toggleNewPost(!showNewPost))
  }

  const _removeImg = async (idx) => {
    const newImgList = [...postImageList]
    newImgList.splice(idx, 1)
    setPostImageList(newImgList)
  }

  const _addImg = async (e) => {
    if(e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const url = await readFileAsUrl(file)
      const newImgList = [...postImageList]
      newImgList.unshift({url: url})
      setPostImageList(newImgList)
    }
  }

  const _submit = async (e) => {
    e.preventDefault()

    const id = Math.random().toString(36).substr(2, 9)
    // const blockObj = blockList.filter(block => block.id === chosenBlock)

    // dispatch(addPostList([
    //   {
    //     id: id,
    //     block: blockObj[0],
    //     body: postText,
    //     imgList: postImageList,
    //     userId: `wokoee9`,
    //     createdAt: new Date().toISOString()
    //   }
    // ]))

    try {
      const response = await axios.post('http://localhost:3004/posts', {
        id: id,
        body: bodyRef.current.value,
        bodyRaw: postText,
        imgList: postImageList,
        userId: profile.id,
        createdAt: new Date().toISOString()
      })
      console.log(response) 
    } catch (err) {
      console.log(err)
    }

    _close()
  }

  const _validateSubmit = () => {
    if((postText.length > 0 || postImageList.length > 0)) {
      return true
    }
    return false
  }

  return (
    showNewPost && (
      <div className="fixed bg-white inset-0 z-30 px-4">
      {
        step === 0 && (
          <div className="pt-12">
            <div className="fixed top-0 left-0 right-0 h-12 px-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute left-0">
                  <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black-1 tracking-tighter">New Post</h3>
                </div>
                <div className="absolute right-0">
                  <button onClick={e => setStep(step+1)} disabled={!chosenBlock}>
                    <h4 className="text-2xl font-bold text-black-1 tracking-tighter">Next</h4>
                  </button>
                </div>
              </div>
            </div>
            <div>
              <div className="mt-8">
                <div>
                  <label className="block text-sm font-semibold text-black-2">Choose Block</label>
                  <div>
                    {
                      blockList.map(block => {
                        return (
                          <div onClick={e => setChosenBlock(block.id)} key={block.id} 
                            className={`mt-4 w-full transition-all duration-300 text-black-3 leading-normal border p-2 rounded-md
                            ${chosenBlock == block.id ? `border-black-3` : `border-black-6`}`}>
                            <p className="text-black-2 font-bold">{ block.name }</p>
                            <p className="mt-1 truncate">{ block.desc }</p>
                          </div>
                        )
                      })
                    }
                    <button onClick={e => dispatch(toggleNewBlock(true))} 
                      className="mt-4 w-full border border-black-1 bg-black-1 p-2 py-4 rounded-md text-white font-semibold leading-relaxed">
                      + Add New Block
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
      {
        step === 1 && (
          <div className="pt-12 h-full">
            <div className="fixed top-0 left-0 right-0 h-12 px-4">
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute left-0">
                <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
                </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-black-1 tracking-tighter">New Post</h3>
                </div>
                <div className="absolute right-0">
                  <button disabled={!_validateSubmit()} onClick={e => _submit(e)} className="text-2xl font-bold text-black-1 tracking-tighter">Done</button>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <div className="">
                <div className="pb-4">
                  <MentionsInput className="outline-none break-words" style={{
                  }} 
                    style={{
                      control: {
                        fontSize: `16px`,
                        fontWeight: `500`
                      },
                      input: {
                        margin: 0,
                        overflow: `auto`,
                        height: `20rem`,
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
                    placeholder="Share your ideas, thought and creativity" 
                    onChange={e => setPostText(e.target.value)} 
                    value={postText}
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
                <div className="h-40">
                  <label className="block text-sm font-semibold text-black-2">Image</label>
                  <div className="flex flex-nowrap overflow-x-auto">
                    <div className="w-1/3 min-w-third -ml-2 relative rounded-md h-24 p-2">
                      <div className="absolute inset-0 opacity-0">
                        <input type="file" onClick={(event)=> { event.target.value = null }} onChange={e => _addImg(e)} className="absolute inset-0 w-full h-full opacity-0" />
                      </div>
                      <div className="flex items-center h-full bg-black-1">
                        <div className="m-auto">
                          <svg className="m-auto" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M2.7 -4.57764e-05L24.3 -4.57764e-05C25.7912 -4.57764e-05 27 1.20878 27 2.69995V24.3C27 25.7912 25.7912 27 24.3 27H2.7C1.20883 27 0 25.7912 0 24.3L0 2.69995C0 1.20878 1.20883 -4.57764e-05 2.7 -4.57764e-05ZM2.7 2.69995L2.7 18.3408L8.1 12.9408L12.825 17.6658L21.6 8.89077L24.3 11.5908V2.69995L2.7 2.69995ZM2.7 24.3V22.1591L8.1 16.7591L15.6408 24.3H2.7ZM24.3 24.3H19.4592L14.7342 19.575L21.6 12.7091L24.3 15.4091V24.3ZM16.2 8.09995C16.2 5.86321 14.3868 4.04995 12.15 4.04995C9.91325 4.04995 8.1 5.86321 8.1 8.09995C8.1 10.3367 9.91325 12.15 12.15 12.15C14.3868 12.15 16.2 10.3367 16.2 8.09995ZM10.8 8.09995C10.8 7.35438 11.4044 6.74995 12.15 6.74995C12.8956 6.74995 13.5 7.35438 13.5 8.09995C13.5 8.84553 12.8956 9.44995 12.15 9.44995C11.4044 9.44995 10.8 8.84553 10.8 8.09995Z" fill="white"/>
                          </svg>
                          <p className="mt-1 text-sm font-semibold text-white">Add Image</p>
                        </div>
                      </div>
                    </div>
                    {
                      postImageList.map((img, idx) => {
                        return (
                          <div key={img.url} className="w-1/3 h-24 min-w-third relative p-2">
                            <div onClick={e => _removeImg(idx)} className="absolute top-0 right-0 mr-3 mt-3 z-10" >
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.400024" y="0.400146" width="16.2" height="16.2" rx="8.1" fill="#222222"/>
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.50008 9.64596L5.02283 13.1232L3.87732 11.9777L7.35456 8.50044L3.87732 5.0232L5.02283 3.87769L8.50008 7.35493L11.9773 3.87769L13.1228 5.0232L9.64559 8.50044L13.1228 11.9777L11.9773 13.1232L8.50008 9.64596Z" fill="white"/>
                            </svg>
                            </div>
                            <img className="h-full m-auto object-contain" src={img.url} />
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
    )
  )
}

export default withRedux(NewPost)