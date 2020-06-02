import { useEffect, useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { setProfile } from '../actions/me'

import PostCard from './PostCard'
import ParseBody from './parseBody'
import { withRedux } from '../lib/redux'
import Pop from './Pop'
import Push from './Push'
import PostCardLoader from './PostCardLoader'
import Image from './Image'
import near from '../lib/near'
import Modal from './Modal'
import { setLoading } from '../actions/ui'
import InfiniteScroll from 'react-infinite-scroll-component'
import InfiniteLoader from './InfiniteLoader'

const Profile = ({ user, hasMore, getPost, mementoList, postList }) => {
  const me = useSelector(state => state.me.profile)
  const [isFollowing, setIsFollowing] = useState(false)
  const [view, setView] = useState('post')
  const dispatch = useDispatch()
  const [confirmLogout, setConfirmLogout] = useState(false)

  useEffect(() => {
    if(me && user) {
      if(Array.isArray(me.following) && me.following.filter(following => following.id === user.username).length > 0) {
        setIsFollowing(true)
      }
    }
  }, [me, user])

  const _toggleFollow = async (me, user) => {
    // cannot follow/unfollow self
    if(me.id === user.id) {
      return
    }

    const newData = {
      id: me.id,
      targetId: user.username, 
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

  const _signOut = async () => {
    await near.wallet.signOut()

    window.location.replace(window.location.origin + '/login')
  }

  return (
    <div className="bg-dark-0 min-h-screen pb-32">
      {
        confirmLogout && (
          <Modal close={() => setConfirmLogout(false)}>
            <div className="max-w-sm m-auto bg-dark-0 shadow-lg rounded-lg">
              <div className="flex flex-col text-center">
                <div className="p-4 border-b">
                  <p>Log out from Paras?</p>
                </div>
                <button className="border-b py-2 font-medium" onClick={() => _signOut()}>Log out</button>
                <button className="py-2 font-medium" onClick={() => setConfirmLogout(false)}>Cancel</button>
              </div>
            </div>
          </Modal>
        )
      }
      <div className="sticky top-0 z-20">
        <div className="bg-dark-0 h-12 px-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-0">
              <Pop>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
                </svg>
              </Pop>
            </div>
            <div>
              <h3 className="text-xl font-bold text-black-1 tracking-tighter">Profile</h3>
            </div>
            <div className="absolute right-0">
              {
                me && user && me.username === user.username  && (
                  <svg onClick={e => setConfirmLogout(true)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.3785 3V12.1636M12.2174 20.9877C7.67905 20.9877 4 17.2918 4 12.7327C4 9.45516 5.90139 6.62375 8.65652 5.29091M12.2174 21C16.7557 21 20.4348 17.3041 20.4348 12.745C20.4348 9.46746 18.5334 6.63605 15.7783 5.3032" stroke="#222222" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )
              }
            </div>
          </div>
        </div>
      </div>
      <div>
        {
          user ? (
            <div>
              <div className="bg-dark-0 py-6 px-4 text-center">
                <Image className="m-auto w-20 h-20 rounded-full overflow-hidden object-cover" data={user.imgAvatar} />
                <h4 className="mt-4 text-xl font-bold">{user.username}</h4>
                <p className="mt-2 text-black-3">
                  <ParseBody body={user.bioRaw || user.bio} />
                </p>
                {
                  me.id && user.id && me.id !== user.id && (
                    <div className="px-4 mt-4">
                      {
                        isFollowing ? (
                          <button onClick={e => _toggleFollow(me, user)} className="font-semibold border border-black-1 border-solid px-2 py-1 text-sm rounded-md" style={{
                            minWidth: `6rem`
                          }}>Following</button>
                        ) : (
                          <button onClick={e => _toggleFollow(me, user)} className="font-semibold bg-black-1 text-white px-2 py-1 text-sm rounded-md" style={{
                            minWidth: `6rem`
                          }}>Follow</button>
                        )
                      }
                    </div>
                  )
                }
                {
                  me.username === user.username && (
                    <div className="px-4 mt-4">
                      <Push href="/me/edit" as={`/me/edit`}>
                        <button className="font-semibold border border-black-1 border-solid px-2 py-1 text-sm rounded-md" style={{
                          minWidth: `6rem`
                        }}>Edit Profile</button>
                      </Push>
                    </div>
                  )
                }
              </div>
              <div>
                <div className="bg-dark-0 flex sticky" style={{
                  top: `3rem`
                }}>
                  <div className={`${view !== 'post' && `opacity-25`} w-1/2  border-b border-black-1`}>
                    <button onClick={_ => setView('post')} className="w-full font-semibold p-4 focus:outline-none">Post</button>
                  </div>
                  <div className={`${view !== 'memento' && `opacity-25`} w-1/2  border-b border-black-1`}>
                    <button onClick={_ => setView('memento')} className="w-full font-semibold p-4 focus:outline-none">Memento</button>
                  </div>
                </div>
                {
                  view === 'post' ? (
                    <div>
                      {
                        postList ? (
                          <InfiniteScroll
                            dataLength={postList.length}
                            next={getPost}
                            hasMore={hasMore}
                            loader={<InfiniteLoader key={0}/>}
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
                  ) : (
                    <div className="px-4">
                      {
                      mementoList && mementoList.map(memento => {
                        return (
                          <div className="mt-6" key={memento.id}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-xl font-bold">{memento.name}</h4>
                              </div>
                              <div>
                                <Push href="/m/[id]" as={`/m/${memento.id}`} props={{
                                  id: memento.id
                                }}>
                                  <p className="font-semibold text-black-4 text-sm">View All</p>
                                </Push>
                              </div>
                            </div>
                            <div className="flex mt-1 -ml-2 -mr-2 justify-between">
                              {
                                memento.postList.map(post => {
                                  return (
                                    <Push key={post.id} href="/post/[id]" as={`/post/${post.id}`} props={{
                                      post: {
                                        ...post,
                                        ...{
                                          user: user,
                                          block: memento
                                        }
                                      }
                                    }}>
                                      <div className="w-1/3">
                                        <div className="w-full relative pb-full">
                                          <div className="absolute inset-0 px-1">
                                            <div className="w-full h-full shadow-subtle bg-dark-0 overflow-hidden rounded-md">
                                              {
                                                post.imgList.length > 0 ? (
                                                  <Image className="w-full h-full object-cover" data={post.imgList[0]} />
                                                ) : (
                                                  <div className="p-1">
                                                    <p className="leading-tight text-xs">{post.body}</p>
                                                  </div>
                                                )
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Push>
                                  )
                                })
                              }
                              {
                                [...Array(Math.max(0, Math.abs(3 - memento.postList.length))).keys()].map(key => {
                                  return (
                                    <div key={key} className="w-1/3 p-1 overflow-hidden"></div>
                                  )
                                })
                              }
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
          ) : (
            <InfiniteLoader />
          )
        }
      </div>
    </div>
  )
}

export default withRedux(Profile)