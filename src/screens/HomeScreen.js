import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'

import Home from '../components/Home'

import { addData } from '../actions/me'
import { withRedux } from '../lib/redux'
import near from '../lib/near'

const HomeScreen = ({  }) => {
  const dispatch = useDispatch()
  const me = useSelector(state => state.me.profile)
  const postList = useSelector(state => state.me.data['/'])

  useEffect(() => {
    const getData = async () => {
      const query = [`status:=published`]
      const postList = await near.contract.getPostListByUserFollowing({
        username: me.username,
        query: query,
        opts: {
          _embed: true,
          _sort: 'createdAt',
          _order: 'desc',
          _limit: 10
        }
      })

      dispatch(addData('/', postList))
    }
    if(!postList && me.id) {
      getData()
    }
  }, [me])
  

  return (
    <Home page={`feed`} postList={postList} />
  )
}

export default withRedux(HomeScreen)