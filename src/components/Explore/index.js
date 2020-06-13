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
                  }} color="#E13128" size={2.8} />
                </button>
              ) : (
                  <button onClick={_getPost}>
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="16" fill="#E13128" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M20.6548 12.6667L20.1744 12.6667C18.4909 12.6824 17.8079 13.402 16.7075 15.8032C16.5838 16.0738 16.5181 16.2175 16.4565 16.3505C14.9799 19.5408 13.4698 20.9492 10.1667 21.0001H8.5V19.3334L10.1538 19.3335C12.6648 19.2947 13.7072 18.3226 14.944 15.6504C15.0038 15.5212 15.0678 15.3814 15.1923 15.1089C16.5365 12.1758 17.6301 11.0236 20.1667 11.0001H20.6548L19.5774 9.92265L20.7559 8.74414L23.8452 11.8334L20.7559 14.9227L19.5774 13.7441L20.6548 12.6667ZM20.6547 20.9999H20.1665C18.5557 20.985 17.5268 20.5148 16.6461 19.4226C16.9731 18.9525 17.28 18.4307 17.5757 17.857C18.2759 18.9497 18.9685 19.3221 20.1743 19.3333L20.6547 19.3333L19.5773 18.2558L20.7558 17.0773L23.8451 20.1666L20.7558 23.2558L19.5773 22.0773L20.6547 20.9999ZM10.1538 12.6665C11.8518 12.6927 12.8782 13.1457 13.7473 14.2626C14.0205 13.6753 14.292 13.1436 14.572 12.666C13.4983 11.555 12.1585 11.0307 10.1667 11H8.5V12.6666L10.1538 12.6665Z" fill="white" />
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