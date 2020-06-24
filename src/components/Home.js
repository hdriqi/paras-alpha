import { withRedux } from "../lib/redux"
import PostCard from './PostCard'
import Link from 'next/link'
import Push from "./Push"
import PostCardLoader from "./PostCardLoader"
import InfiniteScroll from "react-infinite-scroll-component"
import InfiniteLoader from "./InfiniteLoader"

import { useSelector } from "react-redux"
import NavTop from "./NavTop"

const RECOMMENDATIONS = [
  {
    name: 'Music',
    id: "music365.life"
  },
  {
    name: 'Gaming',
    id: "tube.gg"
  },
  {
    name: 'Founder\'s Blog',
    id: "blog.riqi"
  }
]

const Home = ({ postListIds, postById, getPost, hasMore }) => {
  return (
    <div className="bg-dark-0 min-h-screen pb-6">
      <NavTop
        center={
          <h3 className="text-white text-xl font-bold">Home</h3>
        }
        right={
          <div>
            <Push href="/hub/search" as="/hub/search">
              <a className="text-white">
                <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" />
                </svg>
              </a>
            </Push>
          </div>
        }
      />
      {
        postListIds ? (
          postListIds.length > 0 ? (
            <div className="px-4">
              <InfiniteScroll
                dataLength={postListIds.length}
                next={getPost}
                hasMore={hasMore}
                loader={<InfiniteLoader key={0} />}
              >
                {
                  postListIds.map(id => {
                    return (
                      <div className="mt-6" key={id}>
                        <PostCard id={id} />
                      </div>
                    )
                  })
                }
              </InfiniteScroll>
            </div>
          ) : (
              <div className="mt-6">
                <div className="p-4 bg-dark-0 text-center">
                  <p className="tracking-tight text-white">Jump into a memento! <br />Create or discover the digital collective memory</p>
                  <div className="flex flex-wrap justify-center">
                    {
                      RECOMMENDATIONS.map(rec => {
                        return (
                          <Push href="/m/[id]" as={`/m/${rec.id}`} props={{
                            id: rec.id,
                            fetch: true
                          }}>
                            <a>
                              <p className="p-2 text-sm bg-primary-5 text-white mx-2 mt-4 rounded-md">{rec.name}</p>
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
            <div>
              <div className="px-4 pt-6">
                <PostCardLoader />
              </div>
              <div className="px-4 pt-6">
                <PostCardLoader />
              </div>
              <div className="px-4 pt-6">
                <PostCardLoader />
              </div>
            </div>
          )
      }
    </div>
  )
}

export default withRedux(Home)