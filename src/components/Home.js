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
    name: 'Tech',
    id: "avwcsckgvc6"
  },
  {
    name: 'Movies',
    id: "e8jzz3lijyw"
  },
  {
    name: 'Capture 365',
    id: "mwsfpwtqrf1"
  },
  {
    name: 'Paras News',
    id: "fegx4vhpqpu"
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
                    const post = postById[id]
                    return post && !post.isDeleted ? (
                      <div className="mt-6" key={post.id}>
                        <PostCard post={post} />
                      </div>
                    ) : null
                  })
                }
              </InfiniteScroll>
            </div>
          ) : (
              <div className="mt-6">
                <div className="p-4 bg-dark-0 text-center">
                  <p className="tracking-tight">Jump into a memento! <br />Interact or create post carefree</p>
                  <div className="flex flex-wrap justify-center">
                    {
                      RECOMMENDATIONS.map(rec => {
                        return (
                          <Push href="/m/[id]" as={`/m/${rec.id}`} props={{
                            id: rec.id,
                            fetch: true
                          }}>
                            <a>
                              <p className="p-2 text-sm bg-black-3 text-white mr-2 mt-4 `rou`nded-md">{rec.name}</p>
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