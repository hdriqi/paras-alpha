import NavTop from 'components/NavTop'
import Pop from 'components/Pop'
import Page from './Page'
import Push from 'components/Push'
import { useEffect, useState, Fragment } from 'react'
import { useSelector } from 'react-redux'
import ModalPost from 'components/PostCard/Modal'
import Image from 'components/Image'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

let lastScrollTop = 0
let timeout

const PostDetail = ({ post, notFound }) => {
  const me = useSelector(state => state.me.profile)
  const pageList = useSelector(state => state.ui.pageList)
  const meMementoList = useSelector(state => state.me.mementoList)
  const deletedPostList = useSelector(state => state.me.deletedPostList)

  const [showModal, setShowModal] = useState(false)
  const [showAction, setShowAction] = useState(true)

  useEffect(() => {
    const scrollEv = (e) => {
      var st = window.pageYOffset || document.documentElement.scrollTop
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (st > lastScrollTop) {
          setShowAction(false)
        } else {
          setShowAction(true)
        }
        lastScrollTop = st <= 0 ? 0 : st;
      }, 50)
    }
    document.addEventListener('scroll', scrollEv)

    return () => {
      document.removeEventListener('scroll', scrollEv)
    }
  }, [pageList])

  useEffect(() => {
    if (deletedPostList.findIndex(id => id === post.id) > -1) {
      router.back()
    }
  }, [deletedPostList])

  return (
    <div>
      <div className={`bg-dark-0 min-h-screen pb-12`}>
        <NavTop
          left={
            <Pop>
              <a>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
                </svg>
              </a>
            </Pop>
          }
          center={
            <h3 className="text-lg font-bold text-white px-2">Post</h3>
          }
          right={
            <button onClick={_ => setShowModal(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="#E2E2E2" />
                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#E2E2E2" />
                <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="#E2E2E2" />
              </svg>
            </button>
          }
        />
        {
          notFound ? (
            <div className="text-center mt-2 p-2 ">
              <h4 className="text-white text-lg font-semibold">Not Found</h4>
              <p className="text-white-1 pt-2">This post is either deleted or not exist</p>
            </div>
          ) : (
              !post.id ? (
                <div className="px-4">
                  <h4 className="text-white">Loading...</h4>
                </div>
              ) : (
                  <div className="px-4 py-6">
                    {
                      post.memento && (
                        <Fragment>
                          <div className="text-center flex justify-center">
                            <Push href="/m/[id]" as={`/m/${post.mementoId}`} props={{
                              id: post.mementoId
                            }}>
                              <a className="flex items-center bg-dark-2 rounded-md p-2">
                                <div className="w-4 h-4 rounded-sm overflow-hidden">
                                  <Image className="w-full h-full object-fill" data={post.memento.img} />
                                </div>
                                <h4 className="ml-2 font-bold text-white text">{post.mementoId}</h4>
                              </a>
                            </Push>
                          </div>
                        </Fragment>
                      )
                    }
                    <div className="p-2 flex items-center">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full overflow-hidden shadow-inner">
                          <Push href="/[id]" as={`/${post.owner}`} props={{
                            id: post.owner,
                            user: post.user
                          }}>
                            <a>
                              <Image className="object-fill" data={post.user.imgAvatar} />
                            </a>
                          </Push>
                        </div>
                        <div className="ml-2">
                          <Push href="/[id]" as={`/${post.owner}`} props={{
                            id: post.owner,
                            user: post.user
                          }}>
                            <a>
                              <h4 className="text-white font-bold">{post.owner}</h4>
                            </a>
                          </Push>
                        </div>
                      </div>
                    </div>
                    <ModalPost
                      showModal={showModal}
                      setShowModal={setShowModal}
                      post={post}
                      me={me}
                      meMementoList={meMementoList}
                    />
                    {
                      post.contentList.map((page, idx) => {
                        return (
                          <div key={idx} className="py-2">
                            {
                              <Page page={page} />
                            }
                          </div>
                        )
                      })
                    }
                    <div className="flex pt-2 justify-between">
                      <div className="w-1/3">
                        <p className="text-white opacity-60">
                          {timeAgo.format(new Date(post.createdAt / (10 ** 6)))}
                        </p>
                      </div>
                      <div className="w-1/3 text-right">
                        <p className="text-white opacity-60">
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
                    <div className="fixed bg-dark-6 mx-6 rounded-md overflow-hidden duration-500" style={{
                      bottom: `1rem`,
                      transform: `translate3d(0, ${showAction ? `0` : `200%`}, 0)`,
                      width: `300px`,
                      marginLeft: `-150px`,
                      left: `50%`,
                    }}>
                      <div className="flex p-2">
                        <button className="w-1/3 flex items-center justify-center">
                          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.0109 17.1861C14.431 17.1861 18.0143 13.6029 18.0143 9.1828C18.0143 4.76268 14.431 1.17947 10.0109 1.17947C5.59081 1.17947 2.00759 4.76268 2.00759 9.1828C2.00759 13.6029 5.59081 17.1861 10.0109 17.1861ZM10.0109 18.3295C15.0625 18.3295 19.1576 14.2344 19.1576 9.1828C19.1576 4.13124 15.0625 0.0361328 10.0109 0.0361328C4.95936 0.0361328 0.864258 4.13124 0.864258 9.1828C0.864258 14.2344 4.95936 18.3295 10.0109 18.3295Z" fill="white" fillOpacity="0.87" />
                            <path d="M7.86718 10.545V14.3635H6.58092V4.60947H10.1784C11.2458 4.60947 12.081 4.8819 12.6839 5.42677C13.2913 5.97164 13.595 6.69292 13.595 7.59062C13.595 8.53744 13.298 9.26766 12.704 9.78126C12.1145 10.2904 11.2681 10.545 10.165 10.545H7.86718ZM7.86718 9.4932H10.1784C10.8662 9.4932 11.3932 9.33242 11.7594 9.01085C12.1256 8.68482 12.3088 8.21588 12.3088 7.60402C12.3088 7.02342 12.1256 6.55894 11.7594 6.21058C11.3932 5.86222 10.8908 5.68134 10.2521 5.66794H7.86718V9.4932Z" fill="white" fillOpacity="0.87" />
                          </svg>
                          <p className="ml-1 text-white text-xs">Piece</p>
                        </button>
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
                        <button className="w-1/3 flex items-center justify-center">
                          <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M4.8194 16.6558L9.45889 13.7561H15.4905C16.3324 13.7561 17.015 13.0736 17.015 12.2317V3.08499C17.015 2.24306 16.3324 1.56055 15.4905 1.56055H3.29495C2.45302 1.56055 1.77051 2.24306 1.77051 3.08499V12.2317C1.77051 13.0736 2.45302 13.7561 3.29495 13.7561H4.8194V16.6558ZM9.02171 12.2316L6.34386 13.9053V12.2316H3.29498V3.08494H15.4905V12.2316H9.02171ZM5.58164 9.94499V8.42055H10.9172V9.94499H5.58164ZM5.58164 5.37161V6.89606H12.4416V5.37161H5.58164Z" fill="white" fillOpacity="0.87" />
                          </svg>
                          <p className="ml-1 text-xs text-white">Comment</p>
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )
        }
      </div>
    </div >
  )
}

export default PostDetail