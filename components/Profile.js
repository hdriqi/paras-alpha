import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProfile } from '../actions/me'

import PostCard from './PostCard'
import ParseBody from './parseBody'
import { withRedux } from '../lib/redux'
import Pop from './Pop'
import Push from './Push'

const Profile = ({ user, mementoList, postList }) => {
  const me = useSelector(state => state.me.profile)
  const [isFollowing, setIsFollowing] = useState(false)
  const [view, setView] = useState('post')
  const dispatch = useDispatch()

  useEffect(() => {
    if(me && user) {
      if(Array.isArray(me.following) && me.following.filter(following => following.id === user.id).length > 0) {
        setIsFollowing(true)
      }
    }
  }, [me, user])

  const _toggleFollow = async (me, user) => {
    // cannot follow/unfollow self
    if(me.id === user.id) {
      return
    }
    const newMe = {...me}
    if(Array.isArray(me.following)) {
      const followingIdx = me.following.findIndex(following => following.id === user.id)
      if(followingIdx > -1) {
        const newFollowing = [...me.following]
        newFollowing.splice(followingIdx, 1)
        newMe.following = newFollowing
      }
      else {
        const newFollowing = [...me.following]
        newFollowing.push({
          type: 'user',
          id: user.id
        })
        newMe.following = newFollowing
      }
    }
    else {
      newMe.following = [user.id]
    }
    await axios.put(`http://localhost:3004/users/${me.id}`, newMe)
    setIsFollowing(!isFollowing)
    dispatch(setProfile(newMe))
  }

  return (
    <div className="bg-white-1 min-h-screen pb-32">
      <div className="pb-12">
        <div className="fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-0">
              <Pop>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
                </svg>
              </Pop>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Profile</h3>
            </div>
            <div className="absolute right-0">
            </div>
          </div>
        </div>
      </div>
      <div>
        {
          user ? (
            <div>
              <div className="bg-white py-6 px-4 text-center">
                <img className="m-auto w-20 h-20 rounded-full overflow-hidden object-cover" src={user.avatarUrl} />
                <h4 className="mt-4 text-2xl font-bold">{user.username}</h4>
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
                <div className="bg-white flex">
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
                        postList && postList.map(post => {
                          return (
                            <div className="mt-6 shadow-subtle" key={post.id}>
                              <PostCard post={post} />
                            </div>
                          )
                        })
                      }
                    </div>
                  ) : (
                    <div className="px-4">
                      {
                      mementoList.map(memento => {
                        return (
                          <div className="mt-6" key={memento.id}>
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-2xl font-bold">{memento.name}</h4>
                              </div>
                              <div>
                                <Push href="/m/[id]" as={`/m/${memento.id}`} props={{
                                  memento: memento
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
                                            <div className="w-full h-full shadow-subtle bg-white overflow-hidden rounded-md">
                                              {
                                                post.imgList.length > 0 ? (
                                                  <img className="w-full h-full object-cover" src={post.imgList[0].url} />
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
            <p>Loading</p>
          )
        }
      </div>
    </div>
  )
}

export default withRedux(Profile)