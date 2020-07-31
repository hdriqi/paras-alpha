import PostCard from './PostCard'
import Push from "./Push"
import PostCardLoader from "./PostCardLoader"
import InfiniteScroll from "react-infinite-scroll-component"
import InfiniteLoader from "./InfiniteLoader"

const RECOMMENDATIONS = [
  {
    name: 'Art',
    id: "artprentice.art"
  },
  {
    name: 'Book',
    id: "bookshelf.info"
  },
  {
    name: 'Music',
    id: "90nostalgia.music"
  },
  {
    name: 'Movies',
    id: "movies.movie"
  }
]

const Feed = ({ postListIds, getPost, hasMore }) => {
  return (
    <div>
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
                  <p className="tracking-tight text-white">Explore the mementos! <br />Discover and follow the digital collective memory</p>
                  <div className="flex flex-wrap justify-center">
                    {
                      RECOMMENDATIONS.map((rec, idx) => {
                        return (
                          <div key={idx}>
                            <Push href="/m/[id]" as={`/m/${rec.id}`} props={{
                              id: rec.id,
                              fetch: true
                            }}>
                              <a>
                                <p className="p-2 text-sm bg-primary-5 text-white mx-2 mt-4 rounded-md">{rec.name}</p>
                              </a>
                            </Push>
                          </div>
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

export default Feed