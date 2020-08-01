import { useSelector } from 'react-redux'
import { withRedux } from '../../lib/redux'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

import Push from '../Push'
import { useState, useEffect, useContext } from 'react'
import PostCardLoader from '../PostCardLoader'
import Image from '../Image'
import { CarouselProvider, Slider, Slide, CarouselContext, WithStore, ButtonBack, ButtonNext } from '@evius/pure-react-carousel'
import SlideCommon from '../Slide/Common'
import ModalPost from './Modal'
import ModalPiece from './Piece'
import ModalLogin from './ModalLogin'
import ModalShare from './ModalShare'

TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

const Swiper = ({ post }) => {
  const carouselContext = useContext(CarouselContext);
  const [currentSlide, setCurrentSlide] = useState(carouselContext.state.currentSlide);

  useEffect(() => {
    function onChange() {
      setCurrentSlide(carouselContext.state.currentSlide);
    }
    carouselContext.subscribe(onChange);
    return () => carouselContext.unsubscribe(onChange);
  }, [carouselContext])

  return (
    <div className="relative">
      <Slider ignoreCrossMove={true}>
        {
          post.contentList.map((page, idx) => {
            return (
              <Slide key={idx}>
                <SlideCommon page={page} />
              </Slide>
            )
          })
        }
      </Slider>
      {
        carouselContext.state.totalSlides > currentSlide + 1 && (
          <div className="absolute px-2 opacity-75 hover:opacity-100 transition ease-in-out duration-500" style={{
            top: `50%`,
            right: 0
          }}>
            <ButtonNext>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23Z" fill="#232323" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.29297 8.70718L10.7072 7.29297L15.4143 12.0001L10.7072 16.7072L9.29297 15.293L12.5859 12.0001L9.29297 8.70718Z" fill="white" />
              </svg>

            </ButtonNext>
          </div>
        )
      }
      {
        currentSlide > 0 && (
          <div className="absolute px-2 opacity-75 hover:opacity-100 transition ease-in-out duration-500" style={{
            top: `50%`
          }}>
            <ButtonBack>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23Z" fill="#232323" />
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7073 15.293L12.293 16.7072L7.58594 12.0001L12.293 7.29297L13.7073 8.70718L10.4144 12.0001L13.7073 15.293Z" fill="white" />
              </svg>

            </ButtonBack>
          </div>
        )
      }
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
  }, [carouselContext])

  return (
    <div className="flex p-2">
      <div className="w-1/3">
        <p className="text-white text-white-3 text-xs">
          {timeAgo.format(new Date(post.createdAt / (10 ** 6)))}
        </p>
      </div>
      <div className="w-1/3 text-center">
        <div className="flex h-full items-center justify-center">
          {
            [...Array(carouselContext.state.totalSlides).keys()].map(idx => {
              return (
                <div key={idx} className={`w-2 shadow-sm bg-white ${idx !== currentSlide && 'opacity-50'}`} style={{
                  margin: `0 .1rem`,
                  height: `0.15rem`
                }}></div>
              )
            })
          }
        </div>
      </div>
      <div className="w-1/3 text-right">
        <p className="text-white text-white-3 text-xs">
          {
            post.id !== post.originalId && (
              <Push href="/post/[id]" as={`/post/${post.originalId}`} props={{
                id: post.originalId
              }}>
                <a>
                  Original Post
                </a>
              </Push>
            )
          }
        </p>
      </div>
    </div>
  )
}

const Metadata = WithStore(MetadataComp)

const Post = ({ id }) => {
  const me = useSelector(state => state.me.profile)
  const meMementoList = useSelector(state => state.me.mementoList)
  const postById = useSelector(state => state.entities.postById)
  const [post, setPost] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const [showModalShare, setShowModalShare] = useState(false)
  const [showPiece, setShowPiece] = useState(false)
  const [showModalLogin, setShowModalLogin] = useState(false)

  useEffect(() => {
    setPost(postById[id])
  }, [id, postById])

  if (post && post.isDeleted) {
    return null
  }

  return (
    <div>
      {
        !post ? (
          <div className="bg-dark-0">
            <PostCardLoader />
          </div>
        ) : (
            <div className="rounded-md overflow-hidden bg-dark-6">
              <ModalLogin
                show={showModalLogin}
                onClose={_ => setShowModalLogin(false)}
              />
              <ModalPost
                showModal={showModal}
                setShowModal={setShowModal}
                post={post}
                me={me}
                meMementoList={meMementoList}
              />
              <ModalShare
                showModal={showModalShare}
                setShowModal={setShowModalShare}
                post={post}
              />
              <ModalPiece
                show={showPiece}
                onClose={_ => setShowPiece(false)}
                onComplete={_ => {
                  setShowPiece(false)
                }}
                post={post}
              />
              {
                post.mementoId.length > 0 && post.memento && (
                  <div className="bg-dark-2 text-center p-2 flex justify-center">
                    <Push href="/m/[id]" as={`/m/${post.mementoId}`} props={{
                      id: post.mementoId,
                      fetch: true
                    }}>
                      <a className="flex items-center">
                        <div className="w-4 h-4 rounded-sm overflow-hidden">
                          <Image className="w-full h-full object-fill" data={post.memento.img} />
                        </div>
                        <h4 className="ml-2 font-bold text-white text-sm">{post.mementoId}</h4>
                      </a>
                    </Push>
                  </div>
                )
              }
              <div className="p-2 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full overflow-hidden shadow-inner">
                    <Push href="/[id]" as={`/${post.owner}`} props={{
                      id: post.owner,
                      fetch: true
                    }}>
                      <a>
                        <Image className="object-fill" data={post.user.imgAvatar} />
                      </a>
                    </Push>
                  </div>
                  <div className="ml-2">
                    <Push href="/[id]" as={`/${post.owner}`} props={{
                      id: post.owner,
                      fetch: true
                    }}>
                      <a>
                        <h4 className="text-white text-sm font-bold">{post.owner}</h4>
                      </a>
                    </Push>
                  </div>
                </div>
                <div>
                  <button className="flex items-center" onClick={_ => setShowModal(true)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="#E2E2E2" />
                      <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#E2E2E2" />
                      <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="#E2E2E2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div>
                <CarouselProvider
                  naturalSlideWidth={100}
                  naturalSlideHeight={100}
                  lockOnWindowScroll={true}
                  totalSlides={post.contentList.length}
                >
                  <Swiper post={post} />
                  <div>
                    <Metadata post={post} />
                  </div>
                </CarouselProvider>
              </div>
              <hr className="mx-2 border-white text-white-3" />
              <div className="flex p-2">
                {
                  me.id ? (
                    <button className="w-1/3" onClick={_ => setShowPiece(true)}>
                      <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                        <svg width="18" height="18" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9995 18.0226C7.3597 15.3883 4.76404 12.7626 3.50731 10.4739C2.22413 8.13703 2.33007 6.15457 3.05158 4.73907C4.52976 1.83909 8.73559 0.91125 11.2935 4.14634L11.9994 5.03918L12.7054 4.14639C15.2637 0.91118 19.4698 1.83915 20.9479 4.73907C21.6694 6.15455 21.7753 8.137 20.492 10.4739C19.2352 12.7626 16.6394 15.3883 11.9995 18.0226ZM11.9995 2.24518C8.51978 -1.14377 3.33709 0.215297 1.4479 3.92164C0.419411 5.93939 0.400305 8.55532 1.92953 11.3403C3.44643 14.1028 6.47793 17.0307 11.5641 19.8419L11.9994 20.0825L12.4348 19.8419C17.5211 17.0307 20.5528 14.1028 22.0698 11.3403C23.5991 8.55535 23.5801 5.93941 22.5516 3.92164C20.6624 0.215234 15.4795 -1.14373 11.9995 2.24518Z" fill="white" fillOpacity="0.87" />
                        </svg>
                        <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Piece</h4>
                      </a>
                    </button>
                  ) : (
                      <button className="w-1/3" onClick={_ => setShowModalLogin(true)}>
                        <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                          <svg width="18" height="18" viewBox="0 0 24 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9995 18.0226C7.3597 15.3883 4.76404 12.7626 3.50731 10.4739C2.22413 8.13703 2.33007 6.15457 3.05158 4.73907C4.52976 1.83909 8.73559 0.91125 11.2935 4.14634L11.9994 5.03918L12.7054 4.14639C15.2637 0.91118 19.4698 1.83915 20.9479 4.73907C21.6694 6.15455 21.7753 8.137 20.492 10.4739C19.2352 12.7626 16.6394 15.3883 11.9995 18.0226ZM11.9995 2.24518C8.51978 -1.14377 3.33709 0.215297 1.4479 3.92164C0.419411 5.93939 0.400305 8.55532 1.92953 11.3403C3.44643 14.1028 6.47793 17.0307 11.5641 19.8419L11.9994 20.0825L12.4348 19.8419C17.5211 17.0307 20.5528 14.1028 22.0698 11.3403C23.5991 8.55535 23.5801 5.93941 22.5516 3.92164C20.6624 0.215234 15.4795 -1.14373 11.9995 2.24518Z" fill="white" fillOpacity="0.87" />
                          </svg>
                          <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Piece</h4>
                        </a>
                      </button>
                    )
                }
                {/* {
                  me.id ? (
                    <button className="w-1/3">
                      <Push href="/post/[id]/memento" as={`/post/${post.id}/memento`} props={{
                        id: post.id
                      }}>
                        <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.2527 5.75274H4.05714M16.2527 5.75274L13.5849 3.08496M16.2527 5.75274L13.5849 8.42052M3.29492 12.6127H10.1549M3.29492 12.6127L5.9627 9.94496M3.29492 12.6127L5.9627 15.2805" stroke="#E2E2E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Transmit</h4>
                        </a>
                      </Push>
                    </button>
                  ) : (
                      <button className="w-1/3" onClick={_ => setShowModalLogin(true)}>
                        <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.2527 5.75274H4.05714M16.2527 5.75274L13.5849 3.08496M16.2527 5.75274L13.5849 8.42052M3.29492 12.6127H10.1549M3.29492 12.6127L5.9627 9.94496M3.29492 12.6127L5.9627 15.2805" stroke="#E2E2E2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Transmit</h4>
                        </a>
                      </button>
                    )
                } */}
                {
                  me.id ? (
                    <button className="w-1/3">
                      <Push href="/post/[id]/comment" as={`/post/${post.id}/comment`} props={{
                        id: post.id
                      }}>
                        <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.8194 16.6558L9.45889 13.7561H15.4905C16.3324 13.7561 17.015 13.0736 17.015 12.2317V3.08499C17.015 2.24306 16.3324 1.56055 15.4905 1.56055H3.29495C2.45302 1.56055 1.77051 2.24306 1.77051 3.08499V12.2317C1.77051 13.0736 2.45302 13.7561 3.29495 13.7561H4.8194V16.6558ZM9.02171 12.2316L6.34386 13.9053V12.2316H3.29498V3.08494H15.4905V12.2316H9.02171ZM5.58164 9.94499V8.42055H10.9172V9.94499H5.58164ZM5.58164 5.37161V6.89606H12.4416V5.37161H5.58164Z" fill="white" fillOpacity="0.87" />
                          </svg>
                          <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Comment</h4>
                        </a>
                      </Push>
                    </button>
                  ) : (
                      <button className="w-1/3" onClick={_ => setShowModalLogin(true)}>
                        <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.8194 16.6558L9.45889 13.7561H15.4905C16.3324 13.7561 17.015 13.0736 17.015 12.2317V3.08499C17.015 2.24306 16.3324 1.56055 15.4905 1.56055H3.29495C2.45302 1.56055 1.77051 2.24306 1.77051 3.08499V12.2317C1.77051 13.0736 2.45302 13.7561 3.29495 13.7561H4.8194V16.6558ZM9.02171 12.2316L6.34386 13.9053V12.2316H3.29498V3.08494H15.4905V12.2316H9.02171ZM5.58164 9.94499V8.42055H10.9172V9.94499H5.58164ZM5.58164 5.37161V6.89606H12.4416V5.37161H5.58164Z" fill="white" fillOpacity="0.87" />
                          </svg>
                          <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Comment</h4>
                        </a>
                      </button>
                    )
                }
                {
                  me.id ? (
                    <button className="w-1/3" onClick={_ => setShowModalShare(true)}>
                      <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.79623V8.02302C5.45134 8.33141 2 11.7345 2 18V20.4142L3.70711 18.7071C5.95393 16.4603 8.69021 15.5189 12 15.8718V21.2038L22.5186 12L12 2.79623ZM14 10V7.20377L19.4814 12L14 16.7962V14.1529L13.1644 14.0136C9.74982 13.4445 6.74443 14.0145 4.20125 15.7165C4.94953 11.851 7.79936 10 13 10H14Z" fill="white" />
                        </svg>
                        <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Share</h4>
                      </a>
                    </button>
                  ) : (
                      <button className="w-1/3" onClick={_ => setShowModalLogin(true)}>
                        <a className="flex items-center justify-center hover:bg-dark-2 py-1 rounded-md">
                          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.79623V8.02302C5.45134 8.33141 2 11.7345 2 18V20.4142L3.70711 18.7071C5.95393 16.4603 8.69021 15.5189 12 15.8718V21.2038L22.5186 12L12 2.79623ZM14 10V7.20377L19.4814 12L14 16.7962V14.1529L13.1644 14.0136C9.74982 13.4445 6.74443 14.0145 4.20125 15.7165C4.94953 11.851 7.79936 10 13 10H14Z" fill="white" />
                          </svg>
                          <h4 className="ml-1 text-white text-xs font-semibold tracking-wide">Share</h4>
                        </a>
                      </button>
                    )
                }
              </div>
            </div>
          )
      }
    </div>
  )
}

export default withRedux(Post)