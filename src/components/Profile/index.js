import { useEffect, useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { setProfile } from '../../actions/me'

import PostCard from '../PostCard'
import ParseBody from '../parseBody'
import { withRedux } from '../../lib/redux'
import Pop from '../Pop'
import Push from '../Push'
import PostCardLoader from '../PostCardLoader'
import Image from '../Image'
import near from '../../lib/near'
import Modal from '../Modal'
import { setLoading } from '../../actions/ui'
import InfiniteScroll from 'react-infinite-scroll-component'
import InfiniteLoader from '../InfiniteLoader'
import NavTop from '../NavTop'
import InView from 'react-intersection-observer'
import ProfileModal from './Modal'

const Profile = ({ user = {}, hasMore, getPost, postList }) => {
  const me = useSelector(state => state.me.profile)
  const pageList = useSelector(state => state.ui.pageList)
  const [isFollowing, setIsFollowing] = useState(false)
  const [view, setView] = useState('post')
  const dispatch = useDispatch()

  const [showModal, setShowModal] = useState(false)
  const [stickySubNav, setStickySubNav] = useState(false)

  useEffect(() => {
    if (me && user) {
      if (Array.isArray(me.following) && me.following.filter(following => following.id === user.id).length > 0) {
        setIsFollowing(true)
      }
    }
  }, [me, user])

  const _toggleFollow = async (me, user) => {
    // cannot follow/unfollow self
    if (me.id === user.id) {
      return
    }

    const newData = {
      id: me.id,
      targetId: user.id,
      targetType: 'user'
    }
    const msg = isFollowing ? 'Unfollowing user...' : 'Following user...'
    dispatch(setLoading(true, msg))
    const newMe = await near.contract.toggleUserFollow(newData)

    setIsFollowing(!isFollowing)
    batch(() => {
      dispatch(setProfile(newMe))
      dispatch(setLoading(false))
    })
  }

  return (
    <div className="bg-dark-0 min-h-screen">
      {
        user && (
          <ProfileModal
            showModal={showModal}
            setShowModal={setShowModal}
            me={me}
            user={user}
          />
        )
      }
      {
        pageList.length === 0 ? (
          <NavTop
            center={
              <h3 className="text-lg font-bold text-white pr-2">{stickySubNav ? user.id : `Profile`} </h3>
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
        ) : (
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
                <h3 className="text-lg font-bold text-white px-2">{stickySubNav ? user.id : `Profile`} </h3>
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
          )
      }
      <div className="p-4">
        {
          !user ? (
            <InfiniteLoader />
          ) : (
              <div>
                <div className="flex justify-center items-center">
                  <div className="w-40 h-40 rounded-md overflow-hidden">
                    <Image className="object-cover h-full" data={user.imgAvatar} />
                  </div>
                </div>
                <div className="pt-4 flex justify-center items-center">
                  <div>
                    <InView rootMargin={`-48px 0px 0px 0px`} onChange={(inView, entry) => setStickySubNav(!inView)}>
                      <p className="text-white text-xl font-semibold">{user.id}</p>
                    </InView>
                  </div>
                </div>
                <div className="pt-2 text-center">
                  <p className="text-white opacity-87">{user.bio}</p>
                </div>
                <div className="text-center pt-4">
                  {
                    !isFollowing ? (
                      <button onClick={_toggleFollow} className="bg-primary-5 px-4 py-1 text-xs font-bold text-white rounded-md uppercase">FOLLOW</button>
                    ) : (
                        <button onClick={_toggleFollow} className="border-primary-5 px-4 py-1 text-xs font-bold text-primary-5 rounded-md uppercase">FOLLOWING</button>
                      )
                  }
                </div>
              </div>
            )
        }
        <div>
          <div>
            {
              postList ? (
                <InfiniteScroll
                  dataLength={postList.length}
                  next={getPost}
                  hasMore={hasMore}
                  loader={<InfiniteLoader key={0} />}
                >
                  {
                    postList.map(post => {
                      return (
                        <div className='mt-6 shadow-subtle' key={post.id}>
                          <PostCard post={post} />
                        </div>
                      )
                    })
                  }
                </InfiniteScroll>
              ) : (
                  <div className="p-4">
                    <PostCardLoader />
                  </div>
                )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRedux(Profile)