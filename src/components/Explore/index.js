import NavTop from "components/NavTop"
import PostCard from "components/PostCard"
import PostCardLoader from "components/PostCardLoader"
import { useState } from "react"
import { RotateSpinLoader } from 'react-css-loaders'

const Explore = ({ post, getPost }) => {
  const [loading, setLoading] = useState(false)

  const _getPost = async () => {
    setLoading(true)
    await getPost()
    setTimeout(() => {
      setLoading(false)
    }, 250)
  }

  return (
    <div className="bg-dark-0 min-h-screen pb-6">
      <NavTop
        center={
          <h3 className="text-white text-xl font-bold">Explore</h3>
        }
        right={
          <div className="flex items-center">
            {
              loading ? (
                <button>
                  <RotateSpinLoader style={{
                    margin: `auto`
                  }} color="#E13128" size={2.4} />
                </button>
              ) : (
                  <button onClick={_getPost}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="#E13128" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M19.7239 13.3334L19.3395 13.3334C17.9928 13.3459 17.4463 13.9216 16.566 15.8426C16.4671 16.059 16.4144 16.174 16.3652 16.2804C15.1839 18.8326 13.9758 19.9593 11.3333 20H10V18.6667L11.323 18.6668C13.3319 18.6358 14.1658 17.8581 15.1552 15.7204C15.203 15.617 15.2542 15.5051 15.3539 15.2871C16.4292 12.9407 17.3041 12.0189 19.3333 12.0001H19.7239L18.8619 11.1381L19.8047 10.1953L22.2761 12.6667L19.8047 15.1381L18.8619 14.1953L19.7239 13.3334ZM19.7237 19.9999H19.3332C18.0446 19.9879 17.2214 19.6118 16.5169 18.738C16.7784 18.3619 17.024 17.9445 17.2605 17.4855C17.8207 18.3597 18.3748 18.6576 19.3394 18.6666L19.7238 18.6666L18.8618 17.8046L19.8046 16.8618L22.276 19.3332L19.8046 21.8046L18.8618 20.8618L19.7237 19.9999ZM11.323 13.3332C12.6814 13.3542 13.5026 13.7166 14.1978 14.6101C14.4164 14.1402 14.6336 13.7149 14.8576 13.3328C13.9987 12.444 12.9268 12.0245 11.3333 12H10V13.3333L11.323 13.3332Z" fill="white" />
                    </svg>
                  </button>
                )
            }

          </div>
        }
      />
      {
        !loading ? (
          <div className="px-4 pt-6" key={post.id}>
            <PostCard post={post} />
          </div>
        ) : (
            <div>
              <div className="px-4 pt-6">
                <PostCardLoader />
              </div>
            </div>
          )
      }
    </div>
  )
}

export default Explore