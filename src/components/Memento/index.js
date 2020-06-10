import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { setProfile } from '../../actions/me'
import { withRedux } from '../../lib/redux'
import Pop from '../Pop'
import Push from '../Push'

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import near from '../../lib/near'
import InfiniteScroll from 'react-infinite-scroll-component'
import { setLoading } from '../../actions/ui'
import InfiniteLoader from '../InfiniteLoader'
import NavTop from '../NavTop'
import InView, { useInView } from 'react-intersection-observer'
import Image from 'components/Image'
import MementoModal from './Modal'
import PostCard from '../PostCard'

const Memento = ({ memento, postList, getPost, hasMore, pendingPostCount, notFound }) => {
  const dispatch = useDispatch()

  const me = useSelector(state => state.me.profile)
  const meMementoList = useSelector(state => state.me.mementoList)

  const [isFollowing, setIsFollowing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [stickySubNav, setStickySubNav] = useState(false)

  useEffect(() => {
    if (Array.isArray(me.following) && me.following.filter(following => following.id === memento.id).length > 0) {
      setIsFollowing(true)
    }
  }, [me, memento])

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

  const _toggleFollow = async () => {
    const msg = isFollowing ? 'Unfollowing memento...' : 'Following memento...'
    dispatch(setLoading(true, msg))
    const target = {
      id: memento.id,
      type: 'memento'
    }
    console.log(target)
    const newMe = await near.contract.toggleFollow({
      target: target
    })

    setIsFollowing(!isFollowing)
    batch(() => {
      dispatch(setProfile(newMe))
      dispatch(setLoading(false))
    })
  }

  return (
    <div className="bg-dark-0 min-h-screen relative">
      <MementoModal
        showModal={showModal}
        setShowModal={setShowModal}
        me={me}
        memento={memento}
      />
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
          <h3 className="text-lg font-bold text-white px-2">{stickySubNav ? memento.id : `Memento`} </h3>
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
      <div className="p-4">
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 rounded-md overflow-hidden">
            <Image className="object-cover h-full" data={memento.img} />
          </div>
        </div>
        <div className="pt-4 flex justify-center items-center">
          <div>
            <InView rootMargin={`-48px 0px 0px 0px`} onChange={(inView, entry) => setStickySubNav(!inView)}>
              <p className="text-white text-xl font-semibold">{memento.id}</p>
            </InView>
          </div>
        </div>
        <div className="pt-2 text-center">
          <p className="text-white opacity-87">{memento.desc}</p>
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
      {
        postList.map(post => {
          return (
            <div className="mx-4 mt-4">
              <PostCard post={post} />
            </div>
          )
        })
      }
      <div className="sticky block md:hidden" style={{
        bottom: `2rem`
      }}>
        <Push href="/new/post" as="/new/post" props={{
          memento: memento
        }}>
          <svg className="ml-auto mr-4" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z" fill="#E13128" />
            <path fillRule="evenodd" clipRule="evenodd" d="M26.5292 38.6667V30.1375H18V26.5292H26.5292V18H30.1375V26.5292H38.6667V30.1375H30.1375V38.6667H26.5292Z" fill="white" />
          </svg>
        </Push>
      </div>
    </div>
  )
}

export default withRedux(Memento)