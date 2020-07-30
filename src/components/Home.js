import { withRedux } from "../lib/redux"
import PostCard from './PostCard'
import Link from 'next/link'
import Push from "./Push"
import PostCardLoader from "./PostCardLoader"
import InfiniteScroll from "react-infinite-scroll-component"
import InfiniteLoader from "./InfiniteLoader"

import { useSelector } from "react-redux"
import NavTop from "./NavTop"
import Feed from "./Feed"

const RECOMMENDATIONS = [
  {
    name: 'Book',
    id: "bookshelf.info"
  },
  {
    name: 'Music',
    id: "music365.life"
  },
  {
    name: 'Movies',
    id: "movies.movie"
  },
  {
    name: 'DIY',
    id: "designedto.design"
  }
]

const Home = ({ postListIds, getPost, hasMore }) => {
  return (
    <div className="bg-dark-0 min-h-screen pb-6">
      <Feed postListIds={postListIds} getPost={getPost} hasMore={hasMore} />
    </div>
  )
}

export default withRedux(Home)