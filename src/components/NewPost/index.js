import { useState, useEffect, useRef, useContext } from 'react'
import { withRedux } from '../../lib/redux'
import { useSelector, useDispatch } from 'react-redux'
import { readFileAsUrl, compressImg } from '../../lib/utils'

import { MentionsInput, Mention } from 'react-mentions'
import ipfs from '../../lib/ipfs'
import PopForward from '../PopForward'
import near from '../../lib/near'
import Image from '../Image'
import { Scrollbars } from 'react-custom-scrollbars'
import { setLoading } from '../../actions/ui'
import NavTop from '../NavTop'
import { CarouselProvider, Slider, Slide, CarouselContext, WithStore } from '@evius/pure-react-carousel'
import axios from 'axios'

let cropper = null

const AddLinkContent = ({ submit, close }) => {
  const [err, setErr] = useState(false)
  const [url, setUrl] = useState('')

  const _submit = async () => {
    const response = await axios.get(`https://paras.id/metaget?link=${url}`)
    const meta = response.data.data
    submit({
      img: meta.image,
      title: meta.title,
      desc: meta.description,
      url: meta.url
    })
  }

  return (
    <div className="fixed inset-0 z-50" style={{
      backgroundColor: `rgba(0,0,0,0.8)`
    }}>
      <div className="max-w-sm m-auto p-4 flex items-center h-full w-full">
        <div className="bg-dark-1 w-full rounded-md overflow-hidden">
          <div className="flex justify-between items-center w-full h-12 bg-dark-4 px-2">
            <div className="w-8 text-white">
              <svg onClick={_ => close()} width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z" fill="white" />
              </svg>
            </div>
            <div className="flex-auto text-white overflow-hidden px-2">Add Text</div>
            <div className="w-8 text-white">
              <svg onClick={_ => {
                _submit()
              }} className="ml-auto" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="#E13128" />
              </svg>
            </div>
          </div>
          <div className="w-full">
            <div className={`
                ${err && 'animated shake'}
                flex items-center h-full
              `}>
              <input type="text" className="w-full text-white px-2 py-2 bg-dark-0" onChange={e => setUrl(e.target.value)} placeholder="https://" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AddImgContent = ({ submit, close, file, viewport }) => {
  const [imgUrl, setImgUrl] = useState('')

  useEffect(() => {
    const readImg = async () => {
      console.log(file)
      try {
        const imgUrl = await readFileAsUrl(file)
        setImgUrl(imgUrl)
      } catch (err) {
        console.log('hm')
        console.log(err)
      }
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
    return () => {
      console.log('unmount')
    }
  }, [imgUrl])

  const _submit = async (e) => {
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

    submit({
      newImgFile: newFile,
      newImgUrl: newImg
    })
  }

  return (
    <div className="fixed inset-0 z-50" style={{
      backgroundColor: `rgba(0,0,0,0.8)`
    }}>
      <div className="max-w-sm m-auto p-4 flex items-center h-full w-full">
        <div className="bg-dark-1 w-full rounded-md overflow-hidden">
          <div className="flex justify-between items-center w-full h-12 bg-dark-4 px-2">
            <div className="w-8 text-white">
              <svg onClick={_ => close()} width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z" fill="white" />
              </svg>
            </div>
            <div className="flex-auto text-white overflow-hidden px-2">Add Image</div>
            <div className="w-8 text-white">
              <svg onClick={e => {
                _submit(e)
              }} className="ml-auto" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="#E13128" />
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

const AddTextContent = () => {
  return (
    <div>

    </div>
  )
}

const AddContent = ({ submit, close, postTextRaw, setPostTextRaw, bodyRef, getUsers }) => {
  const paddingY = 16
  const [maxHeight, setMaxHeight] = useState(0)
  const [lineCount, setLineCount] = useState(0)
  const [err, setErr] = useState(false)
  const [curText, setCurText] = useState(postTextRaw)

  useEffect(() => {
    if (bodyRef) {
      setMaxHeight(bodyRef.current.offsetWidth - (2 * paddingY))
    }
  }, [bodyRef])

  useEffect(() => {
    if (maxHeight > 0 && bodyRef.current.scrollHeight > maxHeight) {
      setPostTextRaw(curText)
      setErr(true)
      setTimeout(() => {
        setErr(false)
      }, 500)
    }
    if (postTextRaw.length > 0) {
      const lineCount = Math.round(bodyRef.current.scrollHeight * 100 / maxHeight)
      setLineCount(lineCount)
    }
    else {
      setLineCount(0)
    }
  }, [postTextRaw])

  const _onChange = (val) => {
    setCurText(postTextRaw)
    setPostTextRaw(val)
  }

  return (
    <div className="fixed inset-0 z-50" style={{
      backgroundColor: `rgba(0,0,0,0.8)`
    }}>
      <div className="max-w-sm m-auto p-4 flex items-center h-full w-full">
        <div className="bg-dark-1 w-full rounded-md overflow-hidden">
          <div className="flex justify-between items-center w-full h-12 bg-dark-4 px-2">
            <div className="w-8 text-white">
              <svg onClick={_ => close()} width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z" fill="white" />
              </svg>
            </div>
            <div className="flex-auto text-white overflow-hidden px-2">Add Text</div>
            <div className="w-8 text-white">
              <svg onClick={_ => {
                submit({
                  postText: bodyRef.current.value,
                  postTextRaw: postTextRaw
                })
              }} className="ml-auto" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="#E13128" />
              </svg>
            </div>
          </div>
          <div className="h-1 w-full relative bg-dark-12 relative">
            <div className="h-full absolute top-0 left-0 bg-primary-5" style={{
              width: `${lineCount}%`
            }}></div>
          </div>
          <div className="w-full relative pb-full">
            <div className="absolute m-auto w-full h-full object-contain">
              <div className={`
                ${err && 'animated shake'}
                flex items-center h-full
              `}>
                <MentionsInput className="outline-none w-full max-w-full"
                  style={{
                    control: {
                      fontSize: `16px`,
                      fontWeight: `500`,
                      color: '#616161'
                    },
                    input: {
                      margin: 0,
                      padding: `0 .5rem`,
                      overflow: `hidden`,
                      maxHeight: `${maxHeight}px`,
                      color: `white`,
                    },
                    suggestions: {
                      marginTop: `20px`,
                      maxHeight: `32rem`,
                      overflowY: 'auto',
                      width: `100vw`,
                      maxWidth: `100%`,
                      boxShadow: `0px 0px 4px rgba(0, 0, 0, 0.15)`
                    },
                  }}
                  placeholder="Share your ideas, thought and creativity"
                  onChange={e => _onChange(e.target.value)}
                  value={postTextRaw}
                  allowSuggestionsAboveCursor={true}
                  inputRef={bodyRef}
                >
                  <Mention
                    trigger='@'
                    data={getUsers}
                    appendSpaceOnAdd={true}
                    style={{
                      color: '#1B1B1B'
                    }}
                    renderSuggestion={(entry) => {
                      return (
                        <div className="flex items-center justify-between px-4 py-2 bg-dark-0 h-16">
                          <div className="w-8/12 flex items-center overflow-hidden">
                            <div>
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <Image style={{
                                  boxShadow: `0 0 4px 0px rgba(0, 0, 0, 0.75) inset`
                                }} className="object-cover w-full h-full" data={entry.imgAvatar} />
                              </div>
                            </div>
                            <div className="px-4 w-auto">
                              <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{entry.username}</p>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  />
                </MentionsInput>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AddPageComp = ({ setCurrentSlide }) => {
  const carouselContext = useContext(CarouselContext);

  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  return (
    <div></div>
  )
}

const AddPage = WithStore(AddPageComp)

const NewPost = ({ memento }) => {
  const blockList = useSelector(state => state.me.blockList)
  const backRef = useRef()
  const dispatch = useDispatch()

  const bodyRef = useRef(null)
  const [chosenMemento, setChosenMemento] = useState({})
  const [postTextRaw, setPostTextRaw] = useState('')
  const [postText, setPostText] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [postImageList, setPostImageList] = useState([])
  const [postImageFileList, setPostImageFileList] = useState([])
  const [step, setStep] = useState(0)

  const [inputMemento, setInputMemento] = useState('')
  const [searchMemento, setSearchMemento] = useState([])

  const _getUsers = async (query, callback) => {
    if (!query) return
    const q = [`username_like:=${query}`]
    const userList = await near.contract.getUserList({
      query: q,
      opts: {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _limit: 10
      }
    })
    const list = userList.map(user => ({
      display: `@${user.username}`,
      id: user.id,
      imgAvatar: user.imgAvatar,
      username: user.username
    }))
    callback(list)
    const suggestionsEl = document.querySelector('.outline-none__suggestions')
    if (suggestionsEl) {
      suggestionsEl.scrollTo(0, suggestionsEl.scrollHeight)
    }
  }

  const _close = () => {
    backRef.current.click()
  }

  const _removeImg = async (idx) => {
    const newImageFileList = [...postImageFileList]
    const newImageList = [...postImageList]
    newImageFileList.splice(idx, 1)
    newImageList.splice(idx, 1)
    setPostImageFileList(newImageFileList)
    setPostImageList(newImageList)
  }

  const _submit = async (e) => {
    e.preventDefault()

    try {
      dispatch(setLoading(true, 'Creating post...'))
      let imgList = []
      let uploadedImgFileList = [...postImageFileList]

      if (uploadedImgFileList.length > 0) {
        const compressImgList = uploadedImgFileList.map(file => {
          return new Promise(async (resolve, reject) => {
            try {
              const content = await compressImg(file)
              resolve({
                content: content
              })
            } catch (err) {
              console.log(err)
            }
          })
        })

        const compressedImgList = await Promise.all(compressImgList)

        for await (const file of ipfs.client.add(compressedImgList)) {
          imgList.push({
            url: file.path,
            type: 'ipfs'
          })
        }
      }

      await near.contract.createPost({
        body: postText,
        bodyRaw: postTextRaw,
        imgList: imgList,
        mementoId: chosenMemento.id
      })

      dispatch(setLoading(false))
      _close()
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (bodyRef.current) {
      setPostText(bodyRef.current.value)
    }
  }, [postTextRaw])

  useEffect(() => {
    if (memento) {
      setChosenMemento(memento)
      setInputMemento(memento.name)
      setSearchMemento([memento])
    }
  }, [])

  const _validateNext = () => {
    if (postText.length > 0 || postImageList.length > 0) {
      if (postText.length <= 300 && postImageList.length <= 3) {
        return true
      }
    }
    return false
  }

  const _validateSubmit = () => {
    if ((postText.length >= 0 || postImageList.length >= 0) && chosenMemento.id) {
      return true
    }
    return false
  }

  const _getSearchMemento = async (query) => {
    setInputMemento(query)
    if (!query) {
      setSearchMemento([])
      return
    }
    if (!query) return
    const q = [`name_like:=${query}`]
    const mementoList = await near.contract.getMementoList({
      query: q,
      opts: {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _limit: 10
      }
    })
    setSearchMemento(mementoList)
  }

  const [pageContent, setPageContent] = useState([{
    type: 'blank'
  }])

  const _addNewPage = () => {
    const clonePageContent = [...pageContent]
    const idx = currentSlide + 1
    clonePageContent.splice(idx, 0, {
      type: 'blank'
    })
    setCurrentSlide(idx)
    setPageContent(clonePageContent)
  }

  const _addImg = async (e, idx) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImgFile(file)
      setShowCreationModal(idx)
    }
  }

  const _addText = (idx) => {
    setShowCreationModal(idx)
  }

  const _addLink = (idx) => {
    setShowCreationModal(idx)
  }

  const _setPageImg = (data) => {
    const clonePageContent = [...pageContent]
    clonePageContent[showCreationModal] = {
      type: 'img',
      body: data.newImgUrl
    }
    setPageContent(clonePageContent)
    setShowCreationModal(-1)
  }

  const _setPageUrl = (data) => {
    const clonePageContent = [...pageContent]
    clonePageContent[showCreationModal] = {
      type: 'url',
      body: data
    }
    setPageContent(clonePageContent)
    setShowCreationModal(-1)
  }

  const _setPageText = (data) => {
    const clonePageContent = [...pageContent]
    clonePageContent[showCreationModal] = {
      type: 'text',
      body: data.postText
    }
    setPageContent(clonePageContent)
    setShowCreationModal(-1)
  }

  const [showCreationModal, setShowCreationModal] = useState(-1)

  return (
    <div id="new-post" className="bg-dark-0 min-h-screen">
      {
        showCreationModal > -1 && (
          // <AddContent close={() => setShowCreationModal(-1)} submit={(data) => _setPageText(data)} postTextRaw={postTextRaw} setPostTextRaw={setPostTextRaw} bodyRef={bodyRef} getUsers={_getUsers} />
          // <AddImgContent
          //   close={() => setShowCreationModal(-1)}
          //   submit={(data) => _setPageImg(data)}
          //   file={imgFile}
          // />
          <AddLinkContent
            close={() => setShowCreationModal(-1)}
            submit={(data) => _setPageUrl(data)}
          />
        )
      }
      <div className={`${step === 0 ? 'visible' : 'hidden'}`}>
        <div className="">
          <NavTop
            left={
              <PopForward ref={backRef}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
                </svg>
              </PopForward>
            }
            center={
              <h3 className="text-lg font-bold text-white">New Post</h3>
            }
            right={
              <button onClick={e => setStep(step + 1)} disabled={!_validateNext()}>
                <svg onClick={_ => setShowModal(true)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12Z" fill="black" />
                </svg>
              </button>
            }
          />
          <div className="mt-8 mx-4">
            <div className="bg-dark-1">
              <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={100}
                lockOnWindowScroll={true}
                disableKeyboard={true}
                currentSlide={currentSlide}
                totalSlides={pageContent.length}
              >
                <Slider ignoreCrossMove={true}>
                  {
                    pageContent.map((content, idx) => {
                      if (content.type === 'blank') {
                        return (
                          <Slide>
                            <div className="relative">
                              <div className="absolute inset-0 opacity-0">
                                <input type="file" multiple accept="image/*" onClick={(e) => { e.target.value = null }} onChange={e => _addImg(e, idx)} className="absolute inset-0 w-full h-full opacity-0" />
                              </div>
                              <p className="text-white">Image</p>
                            </div>
                            <p className="text-white" onClick={_ => _addText(idx)}>Text</p>
                            <p className="text-white" onClick={_ => _addLink(idx)}>Link</p>
                          </Slide>
                        )
                      }
                      else if (content.type === 'img') {
                        return (
                          <Slide>
                            <div className="w-full relative pb-full">
                              <div className="absolute m-auto w-full h-full object-contain">
                                <div className="flex items-center h-full">
                                  <img src={content.body} />
                                </div>
                              </div>
                            </div>
                          </Slide>
                        )
                      }
                      else if (content.type === 'text') {
                        return (
                          <Slide>
                            <div className="w-full relative pb-full">
                              <div className="absolute m-auto w-full h-full overflow-y-auto">
                                <div className="flex h-full px-2">
                                  <p className="mt-auto mb-auto text-left text-white whitespace-pre-line">{content.body}</p>
                                </div>
                              </div>
                            </div>
                          </Slide>
                        )
                      }
                      else if (content.type === 'url') {
                        return (
                          <Slide>
                            <div className="w-full relative pb-full">
                              <div className="absolute m-auto w-full h-full p-2">
                                <a href={content.body.url} target="_blank">
                                  <div className="bg-dark-12 rounded-md overflow-hidden h-full hover:opacity-75">
                                    <div className="relative bg-white" style={{
                                      height: `60%`
                                    }}>
                                      <img className="h-full w-full object-cover" src={content.body.img} />
                                      <div className="absolute inset-0 flex items-center justify-center" style={{
                                        background: `rgba(0,0,0,0.4)`
                                      }}>
                                        <p className="text-white font-bold text-2xl text-center px-2">{content.body.title}</p>
                                      </div>
                                    </div>
                                    <div className="px-2 pb-2" style={{
                                      height: `30%`
                                    }}>
                                      <div className="h-full overflow-hidden">
                                        <p className="text-white opacity-60">{content.body.desc}</p>
                                      </div>
                                    </div>
                                    <div className="px-2 pb-2" style={{
                                      height: `10%`
                                    }}>
                                      <p className="text-white font-medium opacity-87">{content.body.url}</p>
                                    </div>
                                  </div>
                                </a>
                              </div>
                            </div>
                          </Slide>
                        )
                      }
                    })
                  }
                </Slider>
                <AddPage setCurrentSlide={setCurrentSlide} />
              </CarouselProvider>
            </div>
            <div>
              <p className="text-white font-semibold">{currentSlide + 1}/{pageContent.length}</p>
            </div>
            <div>
              <button disabled={!(pageContent.length < 8)} onClick={_ => _addNewPage()} className="px-2 py-1 bg-primary-5 text-white rounded-md font-bold">+ Add Page</button>
            </div>
          </div>
        </div>
      </div>
      <div className={`${step === 1 ? 'visible' : 'hidden'}`}>
        <div className="pt-12 px-4">
          <div className="fixed top-0 left-0 right-0 h-12 px-4">
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute left-0">
                <svg onClick={e => setStep(0)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-black-1 tracking-tighter">Distribute</h3>
              </div>
              <div className="absolute right-0">
                <button disabled={!_validateSubmit()} onClick={e => _submit(e)} className="text-xl font-bold text-black-1 tracking-tighter">Done</button>
              </div>
            </div>
          </div>
          <div>
            <div className="mt-8">
              <div>
                <input type="text" value={inputMemento} onChange={e => _getSearchMemento(e.target.value)} className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" placeholder="Search memento" />
                <div>
                  {
                    inputMemento.length === 0 ? (
                      <div>
                        {
                          blockList.map(memento => {
                            return (
                              <div key={memento.id} onClick={_ => {
                                if (chosenMemento.id === memento.id) {
                                  setChosenMemento({})
                                }
                                else {
                                  setChosenMemento(memento)
                                }
                              }} className={`flex items-center justify-between px-4 py-2 bg-dark-0 mt-4 rounded-sm border ${chosenMemento.id === memento.id ? ` border-black-1` : `border-white`}`}>
                                <div className="w-8/12 flex items-center overflow-hidden">
                                  <div>
                                    <div className="flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1">
                                      <div className="w-4 h-4 m-auto bg-dark-0"></div>
                                    </div>
                                  </div>
                                  <div className="px-4 w-auto">
                                    <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{memento.name}</p>
                                    <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">by {memento.user.username}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{memento.type}</p>
                                </div>
                              </div>
                            )
                          })
                        }
                      </div>
                    ) : (
                        <div>
                          {
                            searchMemento.map(memento => {
                              return (
                                <div key={memento.id} onClick={_ => {
                                  if (chosenMemento.id === memento.id) {
                                    setChosenMemento({})
                                  }
                                  else {
                                    setChosenMemento(memento)
                                  }
                                }} className={`flex items-center justify-between px-4 py-2 bg-dark-0 mt-4 rounded-sm border ${chosenMemento.id === memento.id ? ` border-black-1` : `border-white`}`}>
                                  <div className="w-8/12 flex items-center overflow-hidden">
                                    <div>
                                      <div className="flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1">
                                        <div className="w-4 h-4 m-auto bg-dark-0"></div>
                                      </div>
                                    </div>
                                    <div className="px-4 w-auto">
                                      <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{memento.name}</p>
                                      <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">by {memento.user.username}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{memento.type}</p>
                                  </div>
                                </div>
                              )
                            })
                          }
                        </div>
                      )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRedux(NewPost)