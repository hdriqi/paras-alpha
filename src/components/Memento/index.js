import { useState, useEffect } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { toggleFollow } from '../../actions/me'
import { withRedux } from '../../lib/redux'
import Pop from '../Pop'
import Push from '../Push'

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import InfiniteScroll from 'react-infinite-scroll-component'
import InfiniteLoader from '../InfiniteLoader'
import NavTop from '../NavTop'
import InView from 'react-intersection-observer'
import Image from 'components/Image'
import MementoModal from './Modal'
import PostCard from '../PostCard'
import axios from 'axios'
import { RotateSpinLoader } from 'react-css-loaders'
import { useRouter } from 'next/router'
import PostCardLoader from 'components/PostCardLoader'
import ReactTooltip from "react-tooltip"

const MementoData = ({ isNotFound, memento, isFollowing, isSubmitting, toggleFollow, setStickySubNav }) => {
  const me = useSelector(state => state.me.profile)
  if (isNotFound) {
    return (
      <div className="p-4 text-center">
        <h4 className="text-white text-lg font-semibold">Not Found</h4>
        <p className="text-white-1 pt-2">This memento is either deleted or not exist</p>
      </div>
    )
  }
  if (memento) {
    return (
      <div className="p-4">
        <ReactTooltip />
        <div className="flex justify-center items-center">
          <div className="w-40 h-40 rounded-md overflow-hidden">
            <Image className="object-cover h-full" data={memento.img} />
          </div>
        </div>
        <div className="pt-2 flex flex-col justify-center items-center">
          <div className="flex items-center">
            <div className="flex p-2 uppercase font-bold tracking-wide bg-dark-6 text-white mx-2 mt-4 rounded-lg" style={{
              fontSize: '0.75rem'
            }}>
              <p>{memento.isArchive && 'Archived'}</p>
              <div className="pl-1 text-white-2">
                <a data-place="bottom" data-tip="This memento is currently archived, no one can write new post to this memento.">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM13.0036 13.9983H14.003V15.9983H10.003V13.9983H11.003V11.9983H10.003V9.99835H13.0036V13.9983ZM13.0007 7.99835C13.0007 8.55063 12.5528 8.99835 12.0003 8.99835C11.4479 8.99835 11 8.55063 11 7.99835C11 7.44606 11.4479 6.99835 12.0003 6.99835C12.5528 6.99835 13.0007 7.44606 13.0007 7.99835Z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <InView rootMargin={`-48px 0px 0px 0px`} onChange={(inView, entry) => setStickySubNav(!inView)}>
              <p className="text-white text-xl font-semibold">{memento.id}</p>
            </InView>
          </div>
        </div>
        <div className="flex justify-center text-sm">
          <h4 className="text-white mr-1">by</h4>
          <Push href="/[id]" as={`/${memento.owner}`} props={{
            id: memento.owner,
            fetch: true
          }}>
            <a>
              <h4 className="text-white font-semibold">{memento.owner}</h4>
            </a>
          </Push>
        </div>
        <div className="pt-2 text-center">
          <p className="text-white text-white-2">{memento.desc}</p>
        </div>
        {
          me && me.id && (
            <div className="flex justify-center pt-4">
              {
                !isFollowing ? (
                  <button onClick={toggleFollow} className="border border-primary-5 bg-primary-5 px-4 text-xs font-bold text-white rounded-md uppercase tracking-wider h-8 w-32">
                    {
                      isSubmitting ? (
                        <RotateSpinLoader style={{
                          margin: `auto`
                        }} color="white" size={1.6} />
                      ) : 'FOLLOW'
                    }
                  </button>
                ) : (
                    <button onClick={toggleFollow} className="border border-primary-5 px-4 text-xs font-bold text-primary-5 rounded-md uppercase tracking-wider h-8 w-32">
                      {
                        isSubmitting ? (
                          <RotateSpinLoader style={{
                            margin: `auto`
                          }} color="#e13128" size={1.6} />
                        ) : 'FOLLOWING'
                      }
                    </button>
                  )
              }
            </div>
          )
        }
      </div>
    )
  }
  return null
}

const Memento = ({ memento, postListIds, postById, mementoById, getPost, hasMore }) => {
  const dispatch = useDispatch()

  const me = useSelector(state => state.me.profile)
  const followList = useSelector(state => state.me.followList)
  const deletedMementoList = useSelector(state => state.me.deletedMementoList)
  const router = useRouter()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [stickySubNav, setStickySubNav] = useState(false)

  useEffect(() => {
    if (memento && memento.id && followList.includes(memento.id)) {
      setIsFollowing(true)
    }
  }, [memento, followList])

  useEffect(() => {
    if (deletedMementoList.findIndex(id => id === memento.id) > -1) {
      router.back()
    }
  }, [deletedMementoList])

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
    setIsSubmitting(true)
    try {
      if (isFollowing) {
        await axios.post(`${process.env.BASE_URL}/unfollow`, {
          targetId: memento.id,
          targetType: 'memento'
        })
      }
      else {
        await axios.post(`${process.env.BASE_URL}/follow`, {
          targetId: memento.id,
          targetType: 'memento'
        })
      }
      setIsFollowing(!isFollowing)
      dispatch(toggleFollow(memento.id))
    } catch (err) {
      console.log(err)
    }
    setIsSubmitting(false)
  }

  if (!memento) {
    return null
  }

  return (
    <div className="bg-dark-0 min-h-screen relative">
      <MementoModal
        showModal={showModal}
        setShowModal={setShowModal}
        me={me}
        memento={mementoById[memento.id]}
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
      {
        !memento ? (
          <InfiniteLoader />
        ) : (
            <MementoData isNotFound={memento.isNotFound} memento={mementoById[memento.id]} isFollowing={isFollowing} isSubmitting={isSubmitting} toggleFollow={_toggleFollow} setStickySubNav={setStickySubNav} />
          )
      }
      <div className="pb-6">
        {
          postListIds ? (
            <InfiniteScroll
              dataLength={postListIds.length}
              next={getPost}
              hasMore={hasMore}
              loader={<InfiniteLoader key={0} />}
            >
              {
                postListIds.map(id => {
                  return (
                    <div key={id} className="mx-4 mt-6">
                      <PostCard id={id} />
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
      {
        me && me.id && mementoById[memento.id] && !mementoById[memento.id].isArchive && 
        (mementoById[memento.id].type === 'public' || mementoById[memento.id].owner === me.id)
        && (
          <div className="fixed block md:hidden" style={{
            bottom: `2rem`,
            right: `0`
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
        )
      }
    </div>
  )
}

export default withRedux(Memento)