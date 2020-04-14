import Link from 'next/link'
import axios from 'axios'
import { useState, useEffect } from 'react'

const HubUser = ({ me, user, toggleFollow }) => {
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if(Array.isArray(me.following) && me.following.filter(following => following.id === user.id).length > 0) {
      setIsFollowing(true)
    }
  }, [me, user])

  const _toggleFollow = async (me, user) => {
    await toggleFollow(me, user)
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="flex justify-between items-center bg-white ">
      <div className="w-8/12 flex items-center p-4 overflow-hidden">
        <div>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img className="object-cover w-full h-full" src={user.avatarUrl} />
          </div>
        </div>
        <div className="px-4 w-auto">
          <Link href="/[username]" as={ `/${user.username}` }>
            <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{ user.username }</p>
          </Link>
          <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{ user.bio }</p>
        </div>
      </div>
      <div className="w-4/12">
        {
          me.id && user.id && me.id !== user.id && (
            <div className="px-4">
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
    </div>
  )
}

const HubBlock = ({ me, block, toggleFollow }) => {
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if(Array.isArray(me.following) && me.following.filter(following => following.id === block.id).length > 0) {
      setIsFollowing(true)
    }
  }, [me, block])

  const _toggleFollow = async (me, block) => {
    await toggleFollow(me, block)
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="flex justify-between items-center bg-white ">
      <div className="w-8/12 flex items-center p-4 overflow-hidden">
        <div>
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img className="object-cover w-full h-full" src={block.avatarUrl} />
          </div>
        </div>
        <div className="px-4 w-auto">
          <Link href="/block/[id]" as={ `/block/${block.id}` }>
            <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{ block.name }</p>
          </Link>
          <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{ block.desc }</p>
        </div>
      </div>
      <div className="w-4/12">
        {
          me.id && block.userId && me.id !== block.userId && (
            <div className="px-4">
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
    </div>
  )
}

const HubPage = ({ me, list, page }) => {
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
      newMe.following = [
        {
          type: 'user',
          id: user.id
        }
      ]
    }
    delete newMe.followingDetail
    await axios.put(`http://localhost:3004/users/${me.id}`, newMe)
  }

  return (
    me.id ? (
      <div className="bg-white-1 pb-32 min-h-screen">
        <div className="pb-16">
          <div className="fixed z-10 top-0 left-0 right-0 bg-white shadow-subtle px-4 py-2">
            <div className="w-full h-full relative">
              <div className="flex ">
                <Link href="/hub/following">
                  {
                    page === 'following' ? (
                      <h1 className="text-3xl font-bold">Following</h1>
                    ) : (
                      <h1 className="text-3xl font-bold text-black-3">Following</h1>
                    )
                  }
                </Link>
                <Link href="/hub/recent">
                  {
                    page === 'recent' ? (
                      <h1 className="ml-4 text-3xl font-bold">Newest</h1>
                    ) : (
                      <h1 className="ml-4 text-3xl font-bold text-black-3">Newest</h1>
                    )
                  }
                </Link>
              </div>
              <div className="absolute top-0 right-0 py-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="black"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        {
          page === 'following' ? (
            list.map((following, idx) => {
              return (
                <div key={following.id} className="mt-6 shadow-subtle">
                  {
                    following.type === 'user' ? (
                      <HubUser me={me} user={list[idx]} toggleFollow={_toggleFollow} />
                    ) : (
                      <HubBlock me={me} block={list[idx]} toggleFollow={_toggleFollow} />
                    )
                  }
                </div>
              )
            })
          ) : (
            list.map((following, idx) => {
              return (
                <div key={following.id} className="mt-6 shadow-subtle">
                  {
                    following.type === 'user' ? (
                      <HubUser me={me} user={list[idx]} toggleFollow={_toggleFollow} />
                    ) : (
                      <HubBlock me={me} block={list[idx]} toggleFollow={_toggleFollow} />
                    )
                  }
                </div>
              )
            })
          )
        }
      </div>
    ) : (
      <div>Loading</div>
    )
  )
}

export default HubPage