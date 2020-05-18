import { withRedux } from "../lib/redux"
import PostCard from './PostCard'
import Link from 'next/link'
import Push from "./Push"
import PostCardLoader from "./PostCardLoader"
import InfiniteScroll from "react-infinite-scroller"
import InfiniteLoader from "./InfiniteLoader"

import { useSelector } from "react-redux"

const RECOMMENDATIONS = [
  {
    name: 'tech',
    id: '123'
  },
  {
    name: 'crypto',
    id: '345'
  },
  {
    name: 'movies',
    id: '345'
  },
  {
    name: 'music',
    id: '123'
  },
  {
    name: 'crypto',
    id: '345'
  },
  {
    name: 'movies',
    id: '345'
  },
  {
    name: 'music',
    id: '123'
  },
]

const Home = ({ postList, page, getPost, hasMore, pageCount }) => {

  const me = useSelector(state => state.me.profile)

  return (
    <div className="bg-white-1 pb-12 min-h-screen">
      <div className="pb-12">
        <div className="fixed z-10 top-0 left-0 right-0 bg-white shadow-subtle px-4 py-2">
          {
            me && me.id ? (
            <div className="w-full h-full flex items-center justify-between">
              <div className="flex">
                <Link href="/">
                  {
                    page === 'feed' ? (
                      <h1 className="text-2xl font-bold">Feed</h1>
                    ) : (
                      <h1 className="text-2xl font-bold text-black-3">Feed</h1>
                    )
                  }
                </Link>
                <Link href="/feed/recent">
                  {
                    page === 'recent' ? (
                      <h1 className="ml-4 text-2xl font-bold">Recent</h1>
                    ) : (
                      <h1 className="ml-4 text-2xl font-bold text-black-3">Recent</h1>
                    )
                  }
                </Link>
              </div>
              <div className="">
                <Push href="/hub/search" as={`/hub/search`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="black"/>
                  </svg>
                </Push>
              </div>
            </div>
            ) : (
              <div className="w-full h-full flex items-center justify-between">
                <div className="flex">
                  <svg width="52" height="36" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M2.5 36H5.7757L4.94237 29.4107C8.4338 29.9286 15.8333 30.1393 17.5 26.8393C19.1667 30.1393 26.5662 29.9286 30.0576 29.4107L29.2243 36H32.5L35 12L25.8597 14.5714C22.7954 15.3571 17.5 17.85 17.5 21.5357C17.5 17.85 12.2046 15.3571 9.14025 14.5714L0 12L2.5 36ZM4.58327 15.1558C7.9166 16.013 15.0719 19.0987 16.7386 24.5844C14.9681 27.3159 11.3626 27.2265 9.12971 27.1699C8.84016 27.1626 8.57248 27.1558 8.33335 27.1558C3.75001 27.1558 4.39698 15.8949 4.58327 15.1558ZM30.4167 15.1558C27.0834 16.013 19.9281 19.0987 18.2614 24.5844C20.0319 27.3159 23.6374 27.2265 25.8703 27.1699C26.1599 27.1626 26.4275 27.1558 26.6667 27.1558C31.25 27.1558 30.603 15.8949 30.4167 15.1558Z" fill="#191F2C"/>
                    <path d="M25.0488 1.46341V9.02439H18V1.45122L25.0488 1.46341ZM24.3049 8.12195L22.1341 2.62195H19.5732V3.42683H20.9634L19.0976 8.09756L19.8415 8.40244L20.4756 6.79268H22.9146L23.5732 8.41463L24.3049 8.12195ZM22.6098 6H20.7927L21.7073 3.71951L22.6098 6Z" fill="#191F2C"/>
                    <path d="M32.8773 8.40244L26.4505 9.43902L25.1334 1.26829L31.5724 0.231707L32.8773 8.40244ZM31.4017 7.35366L31.2675 6.51219L28.6212 6.93902L27.8651 2.2561L26.4627 2.4878L26.5968 3.31707L27.17 3.21951L27.9261 7.90244L31.4017 7.35366Z" fill="#191F2C"/>
                    <path d="M35.3932 7.19512C35.6452 7.19512 35.8973 7.17886 36.1493 7.14634C36.4013 7.10569 36.629 7.03252 36.8322 6.92683C37.0355 6.81301 37.2021 6.65854 37.3322 6.46341C37.4623 6.26016 37.5273 5.99187 37.5273 5.65854C37.5273 5.31707 37.4379 5.04878 37.259 4.85366C37.0802 4.65041 36.8525 4.49593 36.5761 4.39024C36.2997 4.28455 35.9908 4.21951 35.6493 4.19512C35.3078 4.1626 34.9786 4.14634 34.6615 4.14634C34.4908 4.14634 34.3241 4.15041 34.1615 4.15854C34.007 4.15854 33.8647 4.15854 33.7347 4.15854L33.7103 4.90244L34.1127 4.92683L34.0273 9.14634H34.7712L34.8322 7.18293C34.9298 7.19106 35.0233 7.19512 35.1127 7.19512C35.2103 7.19512 35.3038 7.19512 35.3932 7.19512ZM36.7712 5.67073C36.7712 5.84146 36.7347 5.97967 36.6615 6.08537C36.5964 6.18293 36.503 6.26016 36.381 6.31707C36.2672 6.37398 36.1371 6.41463 35.9908 6.43902C35.8444 6.45528 35.694 6.46341 35.5395 6.46341C35.442 6.46341 35.3363 6.46341 35.2225 6.46341C35.1086 6.45528 34.9826 6.44715 34.8444 6.43902L34.881 4.91463C35.5314 4.91463 36.007 4.95935 36.3078 5.04878C36.6168 5.13008 36.7712 5.3374 36.7712 5.67073ZM38.3322 10L32.7469 9.89024L32.881 3.58537L38.4664 3.70732L38.3322 10Z" fill="#191F2C"/>
                    <path d="M44.2445 3.91463L43.9274 9.73171L38.9274 9.47561L39.2323 3.64634L44.2445 3.91463ZM43.3298 4.7439L42.7567 4.71951L42.6957 6.18293L41.0737 6.09756L41.1469 4.63415L40.1835 4.59756L40.1347 5.15854L40.5494 5.17073L40.3786 8.26829L40.9396 8.31707L41.025 6.65854L42.6469 6.7439L42.5615 8.40244L43.1347 8.42683L43.3298 4.7439Z" fill="#191F2C"/>
                    <path d="M51.3541 0.707317L50.598 7.46341L44.2932 6.76829L45.0493 0L51.3541 0.707317ZM50.0127 6.58537L48.6346 1.46341L46.3419 1.19512L46.2688 1.91463L47.5005 2.06098L45.3663 6.03658L46.0005 6.39024L46.7322 5.02439L48.9029 5.2561L49.3297 6.78049L50.0127 6.58537ZM48.72 4.52439L47.0858 4.34146L48.1468 2.39024L48.72 4.52439Z" fill="#191F2C"/>
                  </svg>
                </div>
                <div>
                  <Link href="/login" as={`/login`}>
                    <div className="flex items-center">
                      <p>Login</p>
                      <svg className="ml-1" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.5858 9.00001H2V7.00001H10.5858L7.29289 3.70712L8.70711 2.29291L14.4142 8.00001L8.70711 13.7071L7.29289 12.2929L10.5858 9.00001Z" fill="black"/>
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>
            )
          }
        </div>
      </div>
      {
        postList ? (
          postList.length > 0 ? (
            <div>
              <InfiniteScroll
                pageStart={pageCount}
                loadMore={getPost}
                hasMore={hasMore} 
                loader={
                  <InfiniteLoader key={0} />
                }
              >
                {
                  postList.map(post => {
                    return (
                      <div className="mt-6 shadow-subtle" key={post.id}>
                        <PostCard post={post} />
                      </div>
                    )
                  })
                }
              </InfiniteScroll>
            </div>
          ) : (
            <div className="mt-6 shadow-subtle">
              <div className="p-4 bg-white text-center">
                <p className="tracking-tight">Jump into a memento! <br/>Interact or create post carefree</p>
                <div className="flex flex-wrap justify-center">
                  {
                    RECOMMENDATIONS.map(rec => {
                      return (
                        <Push href={'/m/id'} as={`/m/${rec.id}`} props={{
                          id: rec.id
                        }}>
                          <a>
                            <p className="p-2 text-sm bg-black-3 text-white mr-2 mt-4 rounded-md">{rec.name}</p>
                          </a>
                        </Push>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="p-4">
            <PostCardLoader />
            <PostCardLoader />
            <PostCardLoader />
          </div>
        )
      }
    </div>
  )
}

export default withRedux(Home)