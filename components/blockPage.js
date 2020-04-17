import Post from "./post"
import Link from 'next/link'
import { useRouter } from "next/router"

import axios from 'axios'
import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setProfile } from "../actions/me"

const Block = ({ me, block, postList }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if(Array.isArray(me.following) && me.following.filter(following => following.id === block.id).length > 0) {
      setIsFollowing(true)
    }
  }, [me, block])

  const _toggleFollow = async (me, block) => {
    // cannot follow/unfollow block if me follow user
    // if(Array.isArray(me.following) && me.following.filter(following => following.id === block.userId).length > 0) {
    //   console.log('error, unfollow the owner to unfollow this block')
    //   return
    // }
    const newMe = {...me}
    if(Array.isArray(me.following)) {
      const followingIdx = me.following.findIndex(following => following.id === block.id)
      if(followingIdx > -1) {
        const newFollowing = [...me.following]
        newFollowing.splice(followingIdx, 1)
        newMe.following = newFollowing
      }
      else {
        const newFollowing = [...me.following]
        newFollowing.push({
          type: 'block',
          id: block.id
        })
        newMe.following = newFollowing
      }
    }
    else {
      newMe.following = [{
        type: 'block',
        id: block.id
      }]
    }
    await axios.put(`http://localhost:3004/users/${me.id}`, newMe)
    setIsFollowing(!isFollowing)
    dispatch(setProfile(newMe))
  }

  const _close = () => {
    router.back()
  }

  return (
    <div className="py-12 bg-white-1">
      <div className="fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20 shadow-subtle">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute left-0">
            <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Block</h3>
          </div>
          <div className="absolute right-0">
          </div>
        </div>
      </div>
      <div className="py-6">
        <div className="text-center px-4">
          <h4 className="text-2xl font-bold">{block.name}</h4>
          {
            block.user && (
              <p>by&nbsp;
                <Link href="/[username]" as={ `/${block.user.username}` }>
                  <span className="font-semibold text-black-1">{ block.user.username }</span>
                </Link>
              </p>
            )
          }
          <p className="mt-2 text-black-3">{block.desc}</p>
          {
            me.id && block.user && me.id !== block.user.id && (
              <div className="px-4 mt-4">
                {
                  isFollowing ? (
                    <button onClick={e => _toggleFollow(me, block)} className="font-semibold border border-black-1 border-solid px-2 py-1 text-sm rounded-md" style={{
                      minWidth: `6rem`
                    }}>Following</button>
                  ) : (
                    <button onClick={e => _toggleFollow(me, block)} className="font-semibold bg-black-1 text-white px-2 py-1 text-sm rounded-md" style={{
                      minWidth: `6rem`
                    }}>Follow</button>
                  )
                }
              </div>
            )
          }
        </div>
        <div>
          {
            postList.map(post => {
              return (
                <div className="mt-10 shadow-subtle" key={post.id}>
                  <Post post={post} />
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Block