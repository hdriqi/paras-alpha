import { useState, useEffect, useRef, useContext } from 'react'
import { CarouselProvider, Slider, Slide, CarouselContext } from '@evius/pure-react-carousel'
import { dataURItoBlob } from '../../lib/utils'
import NewPostModal from './Modal'
import SlideImage from '../Slide/Image'
import SlideText from '../Slide/Text'
import SlideUrl from '../Slide/Url'
import SlideCommon from '../Slide/Common'

const SlideCounter = ({ setCurrentSlide }) => {
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

const NewPostCreate = ({ content, setContent }) => {
  const backRef = useRef()
  const [currentSlide, setCurrentSlide] = useState(0)

  const [modalData, setModalData] = useState({})
  const [modalInput, setModalInput] = useState(null)

  const _addNewPage = () => {
    const clonePageContent = [...content]
    const idx = currentSlide + 1
    clonePageContent.splice(idx, 0, {
      type: 'blank'
    })
    setCurrentSlide(idx)
    setContent(clonePageContent)
  }

  const _setPage = (result) => {
    const clonePageContent = [...content]
    clonePageContent[modalData.idx] = result
    setContent(clonePageContent)
    setModalData({})
    setModalInput(null)
  }

  const _updatePage = async (idx, content) => {
    if (content.type === 'img') {
      const file = dataURItoBlob(content.body)
      setModalInput(file)
      setModalData({
        idx: idx,
        type: 'img'
      })
    }
    else if (content.type === 'text') {
      console.log(content)
      setModalInput(content.body)
      setModalData({
        idx: idx,
        type: 'text'
      })
    }
    else if (content.type === 'url') {
      setModalInput(content.body.url)
      setModalData({
        idx: idx,
        type: 'url'
      })
    }
  }

  const _clearPage = (idx) => {
    const clonePageContent = [...content]
    clonePageContent[idx] = {
      type: 'blank'
    }
    setContent(clonePageContent)
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
    <div id="new-post">
      {
        modalData.idx > -1 && (
          <NewPostModal
            type={modalData.type}
            left={_ => {
              setModalInput(null)
              setModalData({})
            }}
            right={(result) => _setPage(result)}
            input={modalInput}
          />
        )
      }
      <div>
        <div className="">
          <div className="mt-8 mx-4">
            <div className="bg-dark-1">
              <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={100}
                lockOnWindowScroll={true}
                disableKeyboard={true}
                currentSlide={currentSlide}
                totalSlides={content.length}
              >
                <Slider ignoreCrossMove={true}>
                  {
                    content.map((content, idx) => (
                      <Slide key={idx}>
                        <div>
                          {
                            content.type === 'blank' ? (
                              <div>
                                <div className="w-full h-full relative">
                                  <div className="absolute inset-0 opacity-0">
                                    <input type="file" multiple accept="image/*" onClick={(e) => { e.target.value = null }} onChange={e => _addImg(e, idx)} className="absolute inset-0 w-full h-full opacity-0" />
                                  </div>
                                  <p className="text-white">Image</p>
                                </div>
                                <p className="text-white" onClick={_ => _addText(idx)}>Text</p>
                                <p className="text-white" onClick={_ => _addUrl(idx)}>Link</p>
                              </div>
                            ) : (
                                <div className="flex absolute right-0 p-2 z-10">
                                  <div>
                                    <svg onClick={e => _updatePage(idx, content)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <circle cx="12" cy="12" r="12" fill="#E13128" />
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6624 6C15.0552 6 15.4318 6.15683 15.7068 6.434L17.5673 8.29433C17.8444 8.5713 18 8.94696 18 9.33866C18 9.73037 17.8444 10.106 17.5673 10.383L10.7745 17.173C10.3554 17.6564 9.76132 17.9533 9.08074 18H6V17.4001L6.00195 14.8714C6.05306 14.2387 6.3472 13.6505 6.7959 13.2552L13.6172 6.43473C13.8938 6.15648 14.27 6 14.6624 6ZM9.03837 16.8016C9.35891 16.779 9.65728 16.6298 9.89685 16.3558L14.434 11.8192L12.1813 9.5667L7.61765 14.1288C7.37456 14.3438 7.22418 14.6445 7.19999 14.9197V16.8005L9.03837 16.8016ZM13.03 8.71838L15.2825 10.9707L16.7188 9.53457C16.7708 9.48261 16.8 9.41214 16.8 9.33866C16.8 9.26518 16.7708 9.19472 16.7188 9.14276L14.8566 7.28077C14.8053 7.22899 14.7353 7.19986 14.6624 7.19986C14.5894 7.19986 14.5195 7.22899 14.4681 7.28077L13.03 8.71838Z" fill="white" />
                                    </svg>
                                  </div>
                                  <div className="ml-2">
                                    <svg onClick={e => _clearPage(idx)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F2F2F2" />
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9991 13.0607L8.77941 16.2804L7.71875 15.2197L10.9384 12.0001L7.71875 8.78039L8.77941 7.71973L11.9991 10.9394L15.2187 7.71973L16.2794 8.78039L13.0597 12.0001L16.2794 15.2197L15.2187 16.2804L11.9991 13.0607V13.0607Z" fill="white" />
                                    </svg>
                                  </div>
                                </div>
                              )
                          }
                          < SlideCommon content={content} />
                        </div>
                      </Slide>
                    ))
                  }
                </Slider>
                <SlideCounter setCurrentSlide={setCurrentSlide} />
              </CarouselProvider>
            </div>
            <div>
              <p className="text-white font-semibold">{currentSlide + 1}/{content.length}</p>
            </div>
            <div>
              <button disabled={!(content.length < 8)} onClick={_ => _addNewPage()} className="px-2 py-1 bg-primary-5 text-white rounded-md font-bold">+ Add Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPostCreate