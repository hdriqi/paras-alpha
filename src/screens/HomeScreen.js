import { useEffect, useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'

import Home from '../components/Home'

import { addData } from '../actions/me'
import { withRedux } from '../lib/redux'
import near from '../lib/near'

const HomeScreen = ({  }) => {
  const dispatch = useDispatch()
  const me = useSelector(state => state.me.profile)
  const postList = useSelector(state => state.me.data['/'])
  const hasMore = useSelector(state => state.me.data['/_hasMore'])
  const pageCount = useSelector(state => state.me.data['/_pageCount'])
  const [isFetching, setIsFetching] = useState(false)

  const getFeed = async (page) => {
    if(isFetching) {
      return
    }
    const query = [`status:=published`]
    const curList = postList ? [...postList] : []
    let newPostList = []
    setIsFetching(true)
    if(me && me.id) {
      newPostList = await near.contract.getPostListByUserFollowing({
        username: me.username,
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _skip: page * 5,
          _limit: 5
        }
      })
    }
    else {
      newPostList = await near.contract.getPostList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _skip: page * 5,
          _limit: 5
        }
      })
    }
    const newList = curList.concat(newPostList)
    batch(() => {
      dispatch(addData('/', newList))
      dispatch(addData('/_pageCount', page))
    })
    if(page === 0) {
      dispatch(addData('/_hasMore', true))
    }
    if(newPostList.length === 0) {
      dispatch(addData('/_hasMore', false))
    }
    setIsFetching(false)
  }

  useEffect(() => {
    if(!postList) {
      getFeed(0)
    }
  }, [me])
  

  return (
    <Home page={`feed`} postList={postList} getPost={getFeed} pageCount={pageCount} hasMore={hasMore} />
  )
}

export default withRedux(HomeScreen)