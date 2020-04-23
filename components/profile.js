import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setProfile } from '../actions/me'

import Post from './post'

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
    <div className="min-h-screen">
      <div className="pb-16">
        <div className="fixed bg-white shadow-subtle top-0 left-0 right-0 h-12 px-4 z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-0">
              {
                me.username === user.username ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M18.6562 20.897L20.8733 18.6798L20.0925 15.843L20.4327 15.0305L23 13.5818V10.4464L20.44 8.99173L20.1055 8.18067L20.8961 5.34235L18.6774 3.12683L15.8403 3.90748L15.0296 3.56758L13.5808 1H10.4454L8.99072 3.56004L8.17985 3.89446L5.34198 3.10281L3.1267 5.31809L3.90748 8.15567L3.56758 8.96634L1 10.4151V13.5496L3.55774 15.0076L3.89252 15.8193L3.10197 18.6572L5.31809 20.8733L8.15567 20.0925L8.96644 20.4325L10.4153 22.999H13.5498L15.0067 20.4412L15.8183 20.1065L18.6562 20.897ZM18.8527 13.6256L17.9809 15.7078L18.6362 18.0886L18.0678 18.657L15.692 17.9951L13.609 18.8542L12.3873 20.999H11.5829L10.3714 18.8529L8.29155 17.9808L5.90947 18.6362L5.34203 18.0688L6.00385 15.693L5.14482 13.6101L3 12.3876V11.583L5.1471 10.3715L6.0192 8.29155L5.36375 5.90947L5.93001 5.34321L8.30576 6.00595L10.3895 5.14655L11.6093 3H12.4129L13.6245 5.1471L15.7044 6.0192L18.087 5.36362L18.6558 5.93166L17.9941 8.30696L18.8534 10.3906L21 11.6103V12.4139L18.8527 13.6256ZM12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16ZM14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="black"/>
                  </svg>
                ) : (
                  <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
                  </svg>
                )
              }
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Profile</h3>
            </div>
            <div className="absolute right-0">
            </div>
          </div>
        </div>
      </div>
      <div className="py-6">
        <div className="px-4 text-center">
          <img className="m-auto w-20 h-20 rounded-full overflow-hidden object-cover" src={user.avatarUrl} />
          <h4 className="mt-4 text-2xl font-bold">{user.username}</h4>
          <p className="text-black-3">{user.bio}</p>
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
        </div>
        <div className="py-16">
          <div className="flex">
            <div className="w-1/2">
              <button onClick={_ => setView('post')} className="w-full">Post</button>
            </div>
            <div className="w-1/2">
              <button onClick={_ => setView('memento')}  className="w-full">Memento</button>
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