import ParseBody from './parseBody'
import { useSelector, useDispatch, batch } from 'react-redux'
import { withRedux } from '../lib/redux'
import TimeAgo from 'javascript-time-ago'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

import en from 'javascript-time-ago/locale/en'
import Push from './Push'
import { useState, useRef, useEffect, useContext } from 'react'
import PopForward from './PopForward'
import { deletePost } from '../actions/me'
import PostCardLoader from './PostCardLoader'
import Image from './Image'
import near from '../lib/near'
import { setLoading } from '../actions/ui'
import { CarouselProvider, Slider, Slide, CarouselContext, WithStore } from '@evius/pure-react-carousel'

TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

const ModalPost = ({ me, meMementoList, post, close }) => {
  const dispatch = useDispatch()
  const pageList = useSelector(state => state.ui.pageList)
  const [view, setView] = useState('default')
  const backBtnRef = useRef()

  const _close = (e) => {
    if (!e) {
      setView('default')
      close()
    }
    else if (e.target.id === 'modal-bg') {
      setView('default')
      close()
    }
  }

  const _delete = async (id) => {
    dispatch(setLoading(true, 'Forgetting memory...'))
    await near.contract.deletePostById({
      id: id
    })

    if (pageList.length > 0) {
      backBtnRef.current.click()
    }

    batch(() => {
      dispatch(deletePost(id))
      dispatch(setLoading(false))
    })
    _close()
  }

  const _copyLink = (e) => {
    var copyText = document.getElementById(`urlLink_${post.id}`)
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy")
    setView('confirmCopyLink')
    setTimeout(() => {
      _close()
    }, 1000)
  }

  return (
    <div id="modal-bg" onClick={(e) => _close(e)} className="fixed inset-0 w-full h-full z-40 p-8 pt-40" style={{
      backgroundColor: `rgba(0,0,0,0.5)`
    }}>
      <div className="invisible">
        <PopForward ref={backBtnRef}></PopForward>
      </div>
      <div className="max-w-sm m-auto bg-dark-0 shadow-lg rounded-lg">
        {
          view === 'default' && (
            <div>
              <button className="w-full p-4 font-medium text-left" onClick={_ => _copyLink()}>Copy Link</button>
              {
                (me && me.username == post.user.username || meMementoList.findIndex(memento => memento.id === post.mementoId) > -1) && (
                  <button className="w-full p-4  font-medium text-left" onClick={_ => setView('confirmDelete')}>Forget</button>
                )
              }
            </div>
          )
        }
        {
          view === 'confirmDelete' && (
            <div>
              <p className="p-4">Do you want to forget this memory?</p>
              <div className="flex justify-end">
                <button className="p-4 font-medium text-left" onClick={_ => setView('default')}>Cancel</button>
                <button className="p-4 text-red-600 font-medium text-left" onClick={_ => _delete(post.id)}>Forget</button>
              </div>
            </div>
          )
        }
        {
          view === 'confirmCopyLink' && (
            <div>
              <p className="p-4">Link copied!</p>
            </div>
          )
        }
        <div className="opacity-0 absolute">
          <input readOnly type="text" value={`${window.location.origin}/post/${post.id}`} id={`urlLink_${post.id}`} />
        </div>
      </div>
    </div>
  )
}

const MetadataComp = ({ post }) => {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);
  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext]);

  return (
    <div className="flex p-2">
      <div className="w-1/3">
        <p className="text-white opacity-60 text-xs">
          {timeAgo.format(new Date(post.createdAt))}
        </p>
      </div>
      <div className="w-1/3 text-center">
        <p className="text-white opacity-60 text-xs">
          {currentSlide + 1}/{post.content.length}
        </p>
      </div>
      <div className="w-1/3 text-right">
        <p className="text-white opacity-60 text-xs">
          {/* Original Post */}
        </p>
      </div>
    </div>
  )
}

const Metadata = WithStore(MetadataComp)

const Post = ({ post }) => {
  const me = useSelector(state => state.me.profile)
  const meMementoList = useSelector(state => state.me.blockList)
  const pageList = useSelector(state => state.ui.pageList)
  const deletedPostList = useSelector(state => state.me.deletedPostList)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (showModal) {
      disableBodyScroll(document.querySelector('#modal-bg'), {
        reserveScrollBarGap: true,
      })
    }
    else {
      enableBodyScroll(document.querySelector('#modal-bg'))
    }
  }, [showModal])

  const _isDeleted = () => {
    if (deletedPostList.findIndex(id => id === post.id) > -1) {
      return true
    }
    return false
  }

  if (!post.id) {
    return (
      <div className="bg-dark-0 p-4">
        <PostCardLoader />
      </div>
    )
  }
  else {
    return (
      !_isDeleted() && (
        <div className="rounded-md overflow-hidden bg-dark-1">
          <div className="p-2 flex items-center">
            <div className="h-8 w-8 rounded-full overflow-hidden shadow-inner">
              <img className="object-fill" src="https://images.pexels.com/photos/2253415/pexels-photo-2253415.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" />
            </div>
            <div className="ml-2">
              <p className="text-white text-sm font-bold">{post.owner}</p>
            </div>
          </div>
          <div className="bg-dark-1">
            <CarouselProvider
              naturalSlideWidth={100}
              naturalSlideHeight={100}
              lockOnWindowScroll={true}
              totalSlides={post.content.length}
            >
              <Slider ignoreCrossMove={true}>
                {
                  post.content.map(content => {
                    if (content.type === 'img') {
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
              <div>
                <Metadata post={post} />
              </div>
            </CarouselProvider>
          </div>
          <hr className="mx-2 border-white opacity-60" />
          <div className="flex p-2">
            <button className="w-1/3 flex items-center justify-center">
              <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.0109 17.1861C14.431 17.1861 18.0143 13.6029 18.0143 9.1828C18.0143 4.76268 14.431 1.17947 10.0109 1.17947C5.59081 1.17947 2.00759 4.76268 2.00759 9.1828C2.00759 13.6029 5.59081 17.1861 10.0109 17.1861ZM10.0109 18.3295C15.0625 18.3295 19.1576 14.2344 19.1576 9.1828C19.1576 4.13124 15.0625 0.0361328 10.0109 0.0361328C4.95936 0.0361328 0.864258 4.13124 0.864258 9.1828C0.864258 14.2344 4.95936 18.3295 10.0109 18.3295Z" fill="white" fill-opacity="0.87" />
                <path d="M7.86718 10.545V14.3635H6.58092V4.60947H10.1784C11.2458 4.60947 12.081 4.8819 12.6839 5.42677C13.2913 5.97164 13.595 6.69292 13.595 7.59062C13.595 8.53744 13.298 9.26766 12.704 9.78126C12.1145 10.2904 11.2681 10.545 10.165 10.545H7.86718ZM7.86718 9.4932H10.1784C10.8662 9.4932 11.3932 9.33242 11.7594 9.01085C12.1256 8.68482 12.3088 8.21588 12.3088 7.60402C12.3088 7.02342 12.1256 6.55894 11.7594 6.21058C11.3932 5.86222 10.8908 5.68134 10.2521 5.66794H7.86718V9.4932Z" fill="white" fill-opacity="0.87" />
              </svg>
              <p className="ml-1 text-white text-xs">Appreciate</p>
            </button>
            <button className="w-1/3 flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.2527 5.75274H4.05714M16.2527 5.75274L13.5849 3.08496M16.2527 5.75274L13.5849 8.42052M3.29492 12.6127H10.1549M3.29492 12.6127L5.9627 9.94496M3.29492 12.6127L5.9627 15.2805" stroke="#E2E2E2" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <p className="ml-1 text-white text-xs">Transmit</p>
            </button>
            <button className="w-1/3 flex items-center justify-center">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M4.8194 16.6558L9.45889 13.7561H15.4905C16.3324 13.7561 17.015 13.0736 17.015 12.2317V3.08499C17.015 2.24306 16.3324 1.56055 15.4905 1.56055H3.29495C2.45302 1.56055 1.77051 2.24306 1.77051 3.08499V12.2317C1.77051 13.0736 2.45302 13.7561 3.29495 13.7561H4.8194V16.6558ZM9.02171 12.2316L6.34386 13.9053V12.2316H3.29498V3.08494H15.4905V12.2316H9.02171ZM5.58164 9.94499V8.42055H10.9172V9.94499H5.58164ZM5.58164 5.37161V6.89606H12.4416V5.37161H5.58164Z" fill="white" fill-opacity="0.87" />
              </svg>
              <p className="ml-1 text-white text-xs">Comment</p>
            </button>
          </div>
        </div>
      )
    )
  }
}

export default withRedux(Post)