import { useState, useEffect, useRef, useContext } from 'react'
import { CarouselProvider, Slider, Slide, CarouselContext } from '@evius/pure-react-carousel'
import { dataURItoBlob } from '../../lib/utils'
import NewPostModal from './Modal'
import SlideCommon from '../Slide/Common'
import Confirm from 'components/Utils/Confirm'
import Distribute from './Distribute'

const SlideCounter = ({ setCurrentSlide }) => {
  const carouselContext = useContext(CarouselContext)

  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide)
    }
    carouselContext.subscribe(onChange)
    return () => carouselContext.unsubscribe(onChange)
  }, [carouselContext])

  return (
    <div></div>
  )
}

const NewPostCreate = ({ content, setContent, chosenMemento, setChosenMemento }) => {
  const backRef = useRef(null)
  const inputImgRef = useRef(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [modalData, setModalData] = useState({})
  const [modalInput, setModalInput] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [showConfirmRmvPage, setShowConfirmRmvPage] = useState(false)
  const [showDistribute, setShowDistribute] = useState(true)

  const _addNewPage = () => {
    const clonePageContent = [...content]
    const idx = currentSlide + 1
    clonePageContent.splice(idx, 0, {
      type: 'blank'
    })
    setCurrentSlide(idx)
    setContent(clonePageContent)
  }

  const _removePage = (idx) => {
    const clonePageContent = [...content]
    clonePageContent.splice(idx, 1)
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

  const _addImg = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setModalInput(file)
      setModalData({
        idx: currentSlide,
        type: 'img'
      })
    }
  }

  const _addText = () => {
    setModalData({
      idx: currentSlide,
      type: 'text'
    })
  }

  const _addUrl = () => {
    setModalData({
      idx: currentSlide,
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
      {
        showDistribute && (
          <Distribute
            onClose={_ => setShowDistribute(false)}
            onSubmit={memento => {
              setShowDistribute(false)
              setChosenMemento(memento)
            }}
          />
        )
      }
      <Confirm
        show={showConfirmRmvPage}
        onClose={_ => setShowConfirmRmvPage(false)}
        onComplete={_ => {
          setShowConfirmRmvPage(false)
          _removePage(currentSlide)
        }}
        mainText="Remove current page?"
        leftText="Cancel"
        rightText="Remove"
      />
      <Confirm
        show={showConfirm}
        onClose={_ => setShowConfirm(false)}
        onComplete={_ => {
          setShowConfirm(false)
          _clearPage(currentSlide)
        }}
        mainText="Clear current page?"
        leftText="Cancel"
        rightText="Clear"
      />
      <input ref={inputImgRef} type="file" accept="image/*" onClick={(e) => { e.target.value = null }} onChange={e => _addImg(e)} className="hidden" />
      <div>
        <div className="">
          <div className="mt-4 mx-4">
            <div className=" rounded-md overflow-hidden">
              <div className="w-full bg-dark-6 p-2 cursor-pointer hover:bg-dark-24" onClick={e => setShowDistribute(true)}>
                <div className="text-white-3">
                  {
                    chosenMemento ? (
                      <div className="flex items-center">
                        <div className="w-6 h-6 rounded-sm overflow-hidden">
                          <img className="w-full h-full object-fill" src="https://res.cloudinary.com/teepublic/image/private/s--g-Leur7F--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_eae0c7,e_outline:48/co_eae0c7,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1479303627/production/designs/824678_1.jpg" />
                        </div>
                        <h4 className="ml-2 font-bold text-white">{chosenMemento.type === 'personal' ? `${chosenMemento.name}.${chosenMemento.owner.split('.')[0]}` : `${chosenMemento.name}.${chosenMemento.domain}`}</h4>
                      </div>
                    ) : `Choose a Memento`
                  }
                </div>
              </div>
            </div>
            <div className="mt-4 bg-dark-6 rounded-md overflow-hidden">
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
                    content.map((page, idx) => (
                      <Slide key={idx}>
                        <div className="h-full">
                          {
                            page.type === 'blank' ? (
                              <div className="w-full h-full flex flex-col justify-center items-center relative">
                                <div className="flex items-center justify-center mx-auto">
                                  <div className="p-2">
                                    <button>
                                      <svg onClick={_ => inputImgRef.current.click()} className="cursor-pointer" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="16" cy="16" r="16" fill="#E13128" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8576 10.328C11.9155 10.2474 11.9799 10.1488 12.062 10.0158C12.092 9.96718 12.1738 9.83227 12.2347 9.7318L12.2347 9.73171L12.3033 9.6187C12.9816 8.50923 13.4746 8 14.3636 8H17.6364C18.5254 8 19.0184 8.50923 19.6967 9.6187L19.7654 9.7318C19.8262 9.83226 19.908 9.96718 19.938 10.0158C20.0201 10.1488 20.0844 10.2474 20.1425 10.328C20.1807 10.3812 20.214 10.4234 20.2413 10.4545H22.5455C23.9011 10.4545 25 11.5535 25 12.9091V20.2727C25 21.6284 23.9011 22.7273 22.5455 22.7273H9.45455C8.09894 22.7273 7 21.6284 7 20.2727V12.9091C7 11.5535 8.09894 10.4545 9.45455 10.4545H11.7587C11.7859 10.4234 11.8193 10.3812 11.8576 10.328ZM9.45455 12.0909C9.00268 12.0909 8.63636 12.4572 8.63636 12.9091V20.2727C8.63636 20.7246 9.00268 21.0909 9.45455 21.0909H22.5455C22.9973 21.0909 23.3636 20.7246 23.3636 20.2727V12.9091C23.3636 12.4572 22.9973 12.0909 22.5455 12.0909H20.0909C19.5474 12.0909 19.1808 11.7934 18.8141 11.2836C18.7297 11.1663 18.6461 11.0382 18.5454 10.8752C18.511 10.8193 18.4215 10.6717 18.3601 10.5703L18.3006 10.4722C17.9305 9.86686 17.7073 9.63636 17.6364 9.63636H14.3636C14.2927 9.63636 14.0695 9.86686 13.6994 10.4722L13.6399 10.5703L13.6396 10.5709C13.5782 10.6722 13.4889 10.8194 13.4545 10.8752C13.3539 11.0382 13.2703 11.1663 13.186 11.2836C12.8192 11.7934 12.4526 12.0909 11.9091 12.0909H9.45455ZM22.5455 13.7273C22.5455 14.1792 22.1792 14.5455 21.7273 14.5455C21.2754 14.5455 20.9091 14.1792 20.9091 13.7273C20.9091 13.2754 21.2754 12.9091 21.7273 12.9091C22.1792 12.9091 22.5455 13.2754 22.5455 13.7273ZM11.9091 16.1818C11.9091 18.4411 13.7407 20.2727 16 20.2727C18.2593 20.2727 20.0909 18.4411 20.0909 16.1818C20.0909 13.9225 18.2593 12.0909 16 12.0909C13.7407 12.0909 11.9091 13.9225 11.9091 16.1818ZM18.4545 16.1818C18.4545 17.5375 17.3556 18.6364 16 18.6364C14.6444 18.6364 13.5455 17.5375 13.5455 16.1818C13.5455 14.8262 14.6444 13.7273 16 13.7273C17.3556 13.7273 18.4545 14.8262 18.4545 16.1818Z" fill="white" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="text-white p-2" onClick={_ => _addText(idx)}>
                                    <button>
                                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z" fill="#E13128" />
                                        <path d="M12.4 13.6V12.4H14.8V19.6H13.6V22H18.4V19.6H17.2V12.4H19.6V13.6H22V10H10V13.6H12.4Z" fill="white" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="text-white p-2" onClick={_ => _addUrl(idx)}>
                                    <button>
                                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="16" cy="16" r="16" fill="#E13128" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5 18.25V19.75H11.5C9.42893 19.75 7.75 18.0711 7.75 16C7.75 13.9289 9.42893 12.25 11.5 12.25H14.5V13.75H11.5C10.2574 13.75 9.25 14.7574 9.25 16C9.25 17.2426 10.2574 18.25 11.5 18.25H14.5ZM17.5 13.75V12.25H20.5C22.5711 12.25 24.25 13.9289 24.25 16C24.25 18.0711 22.5711 19.75 20.5 19.75H17.5V18.25H20.5C21.7426 18.25 22.75 17.2426 22.75 16C22.75 14.7574 21.7426 13.75 20.5 13.75H17.5ZM19.75 15.25H12.25V16.75H19.75V15.25Z" fill="white" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                                {
                                  (idx > 0 || content.length > 1) && (
                                    <div onClick={e => setShowConfirmRmvPage(true)} className="mt-4">
                                      <button>
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                          <path d="M31 16C31 24.2843 24.2843 31 16 31C7.71573 31 1 24.2843 1 16C1 7.71573 7.71573 1 16 1C24.2843 1 31 7.71573 31 16Z" stroke="white" stroke-width="2" />
                                          <path fill-rule="evenodd" clip-rule="evenodd" d="M13.9 8H18.1C18.8732 8 19.5 8.65122 19.5 9.45455V10.1818H21.6C22.3732 10.1818 23 10.833 23 11.6364V13.0909C23 13.8942 22.3732 14.5455 21.6 14.5455H21.5439L20.9 22.5455C20.9 23.3488 20.2732 24 19.5 24H12.5C11.7268 24 11.1 23.3488 11.1024 22.6058L10.4559 14.5455H10.4C9.6268 14.5455 9 13.8942 9 13.0909V11.6364C9 10.833 9.6268 10.1818 10.4 10.1818H12.5V9.45455C12.5 8.65122 13.1268 8 13.9 8ZM10.4 11.6364H12.5H19.5H21.6V13.0909H10.4V11.6364ZM11.8605 14.5455H20.1392L19.5024 22.4851L19.5 22.5455H12.5L11.8605 14.5455ZM18.1 9.45455V10.1818H13.9V9.45455H18.1ZM16.9899 18.1818L18.595 19.8494L17.605 20.8779L16 19.2103L14.395 20.8779L13.405 19.8494L15.0101 18.1818L13.405 16.5143L14.395 15.4857L16 17.1533L17.605 15.4857L18.595 16.5143L16.9899 18.1818Z" fill="white" />
                                        </svg>
                                      </button>
                                    </div>
                                  )
                                }
                              </div>
                            ) : (
                                <div className="flex absolute right-0 p-2 z-10">
                                  <div>
                                    <button>
                                      <svg className="shadow-subtle rounded-full" onClick={e => _updatePage(idx, content)} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="12" fill="#E13128" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.6624 6C15.0552 6 15.4318 6.15683 15.7068 6.434L17.5673 8.29433C17.8444 8.5713 18 8.94696 18 9.33866C18 9.73037 17.8444 10.106 17.5673 10.383L10.7745 17.173C10.3554 17.6564 9.76132 17.9533 9.08074 18H6V17.4001L6.00195 14.8714C6.05306 14.2387 6.3472 13.6505 6.7959 13.2552L13.6172 6.43473C13.8938 6.15648 14.27 6 14.6624 6ZM9.03837 16.8016C9.35891 16.779 9.65728 16.6298 9.89685 16.3558L14.434 11.8192L12.1813 9.5667L7.61765 14.1288C7.37456 14.3438 7.22418 14.6445 7.19999 14.9197V16.8005L9.03837 16.8016ZM13.03 8.71838L15.2825 10.9707L16.7188 9.53457C16.7708 9.48261 16.8 9.41214 16.8 9.33866C16.8 9.26518 16.7708 9.19472 16.7188 9.14276L14.8566 7.28077C14.8053 7.22899 14.7353 7.19986 14.6624 7.19986C14.5894 7.19986 14.5195 7.22899 14.4681 7.28077L13.03 8.71838Z" fill="white" />
                                      </svg>
                                    </button>
                                  </div>
                                  <div className="ml-2">
                                    <button>
                                      <svg className="shadow-subtle rounded-full" onClick={e => setShowConfirm(true)} width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F2F2F2" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9991 13.0607L8.77941 16.2804L7.71875 15.2197L10.9384 12.0001L7.71875 8.78039L8.77941 7.71973L11.9991 10.9394L15.2187 7.71973L16.2794 8.78039L13.0597 12.0001L16.2794 15.2197L15.2187 16.2804L11.9991 13.0607V13.0607Z" fill="white" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              )
                          }
                          < SlideCommon page={page} />
                        </div>
                      </Slide>
                    ))
                  }
                </Slider>
                <SlideCounter setCurrentSlide={setCurrentSlide} />
              </CarouselProvider>
            </div>
            <div className="mt-2 flex justify-center">
              <p className="text-white font-semibold">{currentSlide + 1}/{content.length}</p>
            </div>
            <div className="mt-4 flex justify-center">
              <button disabled={!(content.length < 8)} onClick={_ => _addNewPage()} className="px-2 py-1 bg-primary-5 text-white rounded-md font-bold">+ Add Page</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPostCreate