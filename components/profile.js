import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setProfile } from '../actions/me'

import Post from './post'
import ParseBody from './parseBody'

const Profile = ({ me, user, blockList, postList }) => {
  const [isFollowing, setIsFollowing] = useState(false)
  const [view, setView] = useState('post')
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if(Array.isArray(me.following) && me.following.filter(following => following.id === user.id).length > 0) {
      setIsFollowing(true)
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

  const _close = () => {
    router.back()
  }

  return (
    <div className="min-h-screen pb-32">
      <div className="pb-16">
        <div className="fixed bg-white shadow-subtle top-0 left-0 right-0 h-12 px-4 z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-0">
              <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
              </svg>
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
        <div className="py-6 px-4 text-center">
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
                <Link href="/me/edit">
                  <button className="font-semibold border border-black-1 border-solid px-2 py-1 text-sm rounded-md" style={{
                    minWidth: `6rem`
                  }}>Edit Profile</button>
                </Link>
              </div>
            )
          }
        </div>
        <div>
          <div className="flex">
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
                        <Post post={post} />
                      </div>
                    )
                  })
                }
              </div>
            ) : (
              <div className="px-4">
                {
                blockList.map(block => {
                  return (
                    <div className="mt-6" key={block.id}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-2xl font-bold">{block.name}</h4>
                        </div>
                        <div>
                          <Link href="/block/[id]" as={`/block/${block.id}`}>
                            <p className="font-semibold text-black-4 text-sm">View All</p>
                          </Link>
                        </div>
                      </div>
                      <div className="flex mt-1 -ml-2 -mr-2 justify-between">
                        {
                          block.postList.map(post => {
                            return (
                              <Link key={post.id} href="/post/[id]" as={`/post/${post.id}`}>
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
                              </Link>
                            )
                          })
                        }
                        {
                          [...Array(Math.max(0, Math.abs(3 - block.postList.length))).keys()].map(key => {
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
    </div>
  )
}

export default Profile