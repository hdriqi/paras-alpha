import React, { useEffect } from 'react'
import NavMobile from '../../components/NavMobile'
import Home from '../../components/Home'
import { useDispatch, useSelector, batch } from 'react-redux'
import { addData } from '../../actions/me'
import { withRedux } from '../../lib/redux'
import near from '../../lib/near'

const FeedRecentPage = () => {
  const dispatch = useDispatch()
  const postList = useSelector(state => state.me.data['/feed/recent'])
  const hasMore = useSelector(state => state.me.data['/feed/recent_hasMore'])
  const pageCount = useSelector(state => state.me.data['/feed/recent_pageCount'])

  const getRecentPost = async (type) => {
    if(type == 'latest') {
      dispatch(addData('/feed/recent', null))
      dispatch(addData('/feed/recent_pageCount', 0))
    }

    const query = [`status:=published`]
    const curList = postList ? [...postList] : []
    const page = pageCount || 0

    const newPostList = await near.contract.getPostList({
      query: query,
      opts: {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        __skip: page * 5,
        __limit: 5
      }
    })
    const newList = curList.concat(newPostList)
    batch(() => {
      dispatch(addData('/feed/recent', newList))
      dispatch(addData('/feed/recent_pageCount', page + 1))
    })
    if(page === 0) {
      dispatch(addData('/feed/recent_hasMore', true))
    }
    if(newPostList.length === 0) {
      dispatch(addData('/feed/recent_hasMore', false))
    }
  }

  useEffect(() => {
    if(!postList) {
      getRecentPost(0)
    }
  }, [])

  return (
    <div>
      <Home page={`recent`} postList={postList} pageCount={pageCount} getPost={getRecentPost} hasMore={hasMore} />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </div>
  )
}

export default withRedux(FeedRecentPage)