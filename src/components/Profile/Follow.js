import { useDispatch } from 'react-redux'
import { toggleFollow } from 'actions/me'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Push from 'components/Push'
import Image from 'components/Image'
import { RotateSpinLoader } from 'react-css-loaders'

const Follow = ({ follow }) => {
  const dispatch = useDispatch()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFollowing, setIsFollowing] = useState(true)

  const img = follow.targetType === 'user' ? follow.user.imgAvatar : follow.memento.img
  const href = follow.targetType === 'user' ? '/[id]' : '/m/[id]'
  const as = follow.targetType === 'user' ? `/${follow.targetId}` : `/m/${follow.targetId}`

  const _toggleFollow = async () => {
    setIsSubmitting(true)
    try {
      await axios.post(`http://localhost:9090/follow`, {
        targetId: follow.targetId,
        targetType: follow.targetType
      })
      setIsFollowing(!isFollowing)
      dispatch(toggleFollow(follow.targetId))
    } catch (err) {
      console.log(err)
    }
    setIsSubmitting(false)
  }

  return (
    <div className="flex items-center justify-between">
      <Push href={href} as={as} props={{
        id: follow.targetId
      }}>
        <a className="w-4/5 truncate">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full overflow-hidden shadow-inner">
              <Image className="object-fill" data={img} />
            </div>
            <div className="ml-2">
              <h4 className="text-white font-bold">{follow.targetId}</h4>
            </div>
          </div>
        </a>
      </Push>
      <div className="w-1/5 flex">
        {
          !isFollowing ? (
            <button onClick={_toggleFollow} className="border border-primary-5 bg-primary-5 text-xs font-bold text-white rounded-md uppercase tracking-wider h-6 w-full">
              {
                isSubmitting ? (
                  <RotateSpinLoader style={{
                    margin: `auto`
                  }} color="white" size={1.4} />
                ) : (
                  <h4>FOLLOW</h4>
                )
              }
            </button>
          ) : (
              <button onClick={_toggleFollow} className="border border-primary-5 text-xs font-bold text-primary-5 rounded-md uppercase tracking-wider h-6 w-full">
                {
                  isSubmitting ? (
                    <RotateSpinLoader style={{
                      margin: `auto`
                    }} color="#e13128" size={1.4} />
                  ) : (
                    <h4>FOLLOWING</h4>
                  )
                }
              </button>
            )
        }
      </div>
    </div>
  )
}

export default Follow