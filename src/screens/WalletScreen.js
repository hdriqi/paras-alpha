import Wallet from 'components/Wallet'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'

const WalletScreen = () => {
  const me = useSelector(state => state.me.profile)

  const [balance, setBalance] = useState(0)
  const [txList, setTxList] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (me.id) {
      getBalance()
      getTx()
    }
  }, [me])

  const getBalance = async () => {
    const response = await axios.get(`http://localhost:9090/balances?id=${me.id}`)
    setBalance(response.data.data[0].value)
  }

  const getTx = async () => {
    const ITEM_LIMIT = 12
    const page = pageCount || 0

    const response = await axios.get(`http://localhost:9090/transactions?id=${me.id}&_skip=${page * ITEM_LIMIT}&_limit=${ITEM_LIMIT}`)
    
    const newTxList = response.data.data
    const newList = [...txList].concat(newTxList)
    setTxList(newList)
    setPageCount(page + 1)
    // dispatch(addData(`/${id}_postList`, postList))
    // batch(() => {
    //   dispatch(addData(`/${id}_postList`, newList))
    //   dispatch(addData(`/${id}_pageCount`, page + 1))
    // })
    if (page === 0) {
      setHasMore(true)
    }
    if (newTxList.length === 0 && newTxList.length < ITEM_LIMIT) {
      setHasMore(false)
    }
  }

  return (
    <Wallet me={me} balance={balance} txList={txList} getTx={getTx} hasMore={hasMore} />
  )
}

export default WalletScreen