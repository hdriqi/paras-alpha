import { useEffect, useState } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'

import Home from '../components/Home'

import { addData } from '../actions/me'
import { withRedux } from '../lib/redux'
import near from '../lib/near'
import axios from 'axios'

const HomeScreen = ({  }) => {
  const dispatch = useDispatch()
  const me = useSelector(state => state.me.profile)
  const postList = useSelector(state => state.me.data['/'])
  const hasMore = useSelector(state => state.me.data['/_hasMore'])
  const pageCount = useSelector(state => state.me.data['/_pageCount'])

  const getFeed = async (type) => {
    if(type == 'latest') {
      dispatch(addData('/', null))
      dispatch(addData('/_pageCount', 0))
    }

    const ITEM_LIMIT = 5
    const query = [`status:=published`]
    const curList = postList ? [...postList] : []
    let page = pageCount || 0 
    
    const response = await axios.get(`http://localhost:9090/post`)
    let newPostList = response.data.data || []
    
    // if(me && me.id) {
    //   newPostList = await near.contract.getPostListByUserFollowing({
    //     username: me.username,
    //     query: query,
    //     opts: {
    //       _embed: true,
    //       _sort: 'createdAt',
    //       _order: 'desc',
    //       _skip: page * 5,
    //       _limit: 5
    //     }
    //   })
    // }
    // else {
    //   newPostList = await near.contract.getPostList({
    //     query: query,
    //     opts: {
    //       _embed: true,
    //       _sort: 'createdAt',
    //       _order: 'desc',
    //       _skip: page * ITEM_LIMIT,
    //       _limit: ITEM_LIMIT
    //     }
    //   })
    // }
    const newList = curList.concat(newPostList)
    batch(() => {
      dispatch(addData('/', newList))
      dispatch(addData('/_pageCount', page + 1))
    })
    if(page === 0) {
      dispatch(addData('/_hasMore', true))
    }
    if(newPostList.length === 0 && newPostList.length < ITEM_LIMIT) {
      dispatch(addData('/_hasMore', false))
    }
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