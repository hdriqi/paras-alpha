import WalletTransaction from 'components/Wallet/transaction'
import { useSelector, batch } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'

const WalletTransactionScreen = ({ fetch = false }) => {
  const me = useSelector(state => state.me.profile)
  const [balance, setBalance] = useState(0)
  const [txList, setTxList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [pageCount, setPageCount] = useState(0)

  useEffect(() => {
    if (me.id && (pageCount === 0 || fetch)) {
      getBalance()
      getTx()
    }
  }, [me])

  const getBalance = async () => {
    const response = await axios.get(`${process.env.BASE_URL}/balances/${me.id}`)
    dispatch(setBalance(response.data.data))
  }

  const getTx = async () => {
    const ITEM_LIMIT = 12
    const page = pageCount || 0

    const response = await axios.get(`${process.env.BASE_URL}/transactions?id=${me.id}&__skip=${page * ITEM_LIMIT}&__limit=${ITEM_LIMIT}&__sort=-createdAt`)

    const newTxList = response.data.data
    const newList = [...txList].concat(newTxList)
    batch(() => {
      setTxList(newList)
      setPageCount(page + 1)
    })
    if (newTxList.length === 0 && newTxList.length < ITEM_LIMIT) {
      setHasMore(false)
    }
  }

  return (
    <WalletTransaction me={me} balance={balance} txList={txList} getTx={getTx} hasMore={hasMore} />
  )
}

export default WalletTransactionScreen