import Post from "./post"
import Link from 'next/link'
import { useRouter } from "next/router"

import axios from 'axios'
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setProfile } from "../actions/me"
import { toggleModalMemento } from "../actions/ui"
import { withRedux } from "../lib/redux"
import Pop from "./Pop"

const Memento = ({ block = {}, postList = [] }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const [isFollowing, setIsFollowing] = useState(false)
  const me = useSelector(state => state.me.profile)

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
    <div className="py-12 bg-white-1 min-h-screen">
      <div className="fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20 ">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute left-0">
            <Pop>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
              </svg>
            </Pop>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Memento</h3>
          </div>
          <div className="absolute right-0">
            <svg onClick={_ => dispatch(toggleModalMemento(true, block))} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12Z" fill="black"/>
            </svg>
          </div>
        </div>
      </div>
      <div className="pb-12">
        <div className="bg-white py-6 px-4 text-center shadow-subtle">
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
            <p className="mt-2 text-black-3 whitespace-pre ">{block.desc}</p>
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

export default withRedux(Memento)