import Post from "./post"
import Link from 'next/link'
import { useRouter } from "next/router"

const Block = ({ block, postList }) => {
  const router = useRouter()

  const _close = () => {
    router.back()
  }

  return (
    <div className="py-12 bg-white-1">
      <div className="fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20 shadow-subtle">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute left-0">
            <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
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