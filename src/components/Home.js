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