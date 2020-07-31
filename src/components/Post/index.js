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
import ModalPiece from 'components/PostCard/Piece'
import PostCardLoader from 'components/PostCardLoader'
import ModalLogin from 'components/PostCard/ModalLogin'
import PostCard from 'components/PostCard'

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

const PostDetail = ({ id, notFound }) => {
  const me = useSelector(state => state.me.profile)
  const postById = useSelector(state => state.entities.postById)
  const meMementoList = useSelector(state => state.me.mementoList)

  const [post, setPost] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const [showPiece, setShowPiece] = useState(false)
  const [showModalLogin, setShowModalLogin] = useState(false)

  useEffect(() => {
    const post = postById[id]
    if (post) {
      setPost(post)
    }
  }, [id, postById])

  return (
    <div>
      <div className={`bg-dark-0 min-h-screen pb-12`}>
        <NavTop
          left={
            <Pop>
              <a>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M16.0001 17.4143L11.7072 21.7072L10.293 20.293L14.5859 16.0001L10.293 11.7072L11.7072 10.293L16.0001 14.5859L20.293 10.293L21.7072 11.7072L17.4143 16.0001L21.7072 20.293L20.293 21.7072L16.0001 17.4143V17.4143Z" fill="white" />
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
              !post ? (
                <div className="px-4">
                  <div className="bg-dark-0">
                    <PostCardLoader />
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <PostCard id={id} />
                </div>
                )
            )
        }
      </div>
    </div >
  )
}

export default PostDetail