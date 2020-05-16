import React, { useEffect } from 'react'
import NavMobile from '../../components/NavMobile'
import Home from '../../components/Home'
import { useDispatch, useSelector } from 'react-redux'
import { addData } from '../../actions/me'
import { withRedux } from '../../lib/redux'
import near from '../../lib/near'

const FeedRecentPage = () => {
  const dispatch = useDispatch()
  const postList = useSelector(state => state.me.data['/feed/recent'])

  useEffect(() => {
    const getData = async () => {
      const query = [`status:=published`]
      const postList = await near.contract.getPostList({
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })
      console.log(postList)
      dispatch(addData('/feed/recent', postList))
    }
    if(!postList) {
      getData()
    }
  }, [])

  return (
    <div>
      <Home page={`recent`} postList={postList} />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </div>
  )
}

export default withRedux(FeedRecentPage)