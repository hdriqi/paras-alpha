import { useState, useEffect, useRef, useContext } from 'react'
import { withRedux } from '../../lib/redux'
import { useSelector, useDispatch } from 'react-redux'
import { readFileAsUrl, compressImg } from '../../lib/utils'

import ipfs from '../../lib/ipfs'
import PopForward from '../PopForward'
import near from '../../lib/near'
import Image from '../Image'
import { setLoading } from '../../actions/ui'
import NavTop from '../NavTop'
import { CarouselProvider, Slider, Slide, CarouselContext, WithStore } from '@evius/pure-react-carousel'
import NewPostModal from './Modal'

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

  const [chosenMemento, setChosenMemento] = useState({})
  const [postTextRaw, setPostTextRaw] = useState('')
  const [postText, setPostText] = useState('')
  const [imgFile, setImgFile] = useState(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [modalData, setModalData] = useState({})
  const [modalInput, setModalInput] = useState(null)

  const [postImageList, setPostImageList] = useState([])
  const [postImageFileList, setPostImageFileList] = useState([])
  const [step, setStep] = useState(0)

  const [inputMemento, setInputMemento] = useState('')
  const [searchMemento, setSearchMemento] = useState([])

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

  const _setPage = (result) => {
    const clonePageContent = [...pageContent]
    clonePageContent[modalData.idx] = result
    setPageContent(clonePageContent)
    setModalData({})
    setModalInput(null)
  }

  const _addImg = async (e, idx) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setModalInput(file)
      setModalData({
        idx: idx,
        type: 'img'
      })
    }
  }

  const _addText = (idx) => {
    setModalData({
      idx: idx,
      type: 'text'
    })
  }

  const _addUrl = (idx) => {
    setModalData({
      idx: idx,
      type: 'url'
    })
  }

  return (
    <div id="new-post" className="bg-dark-0 min-h-screen">
      {
        modalData.idx > -1 && (
          <NewPostModal 
            type={modalData.type}
            left={_ => setModalData({})} 
            right={(result) => _setPage(result)}
            input={modalInput}
          />
        )
      }
      <div className={`${step === 0 ? 'visible' : 'hidden'}`}>
        <div className="">
          <NavTop
            left={
              <PopForward ref={backRef}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
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
                            <p className="text-white" onClick={_ => _addUrl(idx)}>Link</p>
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
                                    <div className="p-2" style={{
                                      height: `30%`
                                    }}>
                                      <div className="h-full overflow-hidden" style={{
                                        maxHeight: `72px`
                                      }}>
                                        <p className="text-white opacity-60">{content.body.desc}</p>
                                      </div>
                                    </div>
                                    <div className="px-2 pb-2" style={{
                                      height: `10%`
                                    }}>
                                      <p className="text-white font-medium opacity-87 truncate">{content.body.url}</p>
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
                              }} className={`flex items-center justify-between px-4 py-2 bg-dark-0 mt-4 rounded-md border ${chosenMemento.id === memento.id ? ` border-black-1` : `border-white`}`}>
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
                                }} className={`flex items-center justify-between px-4 py-2 bg-dark-0 mt-4 rounded-md border ${chosenMemento.id === memento.id ? ` border-black-1` : `border-white`}`}>
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