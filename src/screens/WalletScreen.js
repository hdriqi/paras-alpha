import Wallet from 'components/Wallet'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { setTxList, setPageCount, setBalance, setHasMore } from 'actions/wallet'

const WalletScreen = ({ fetch = false }) => {
  const dispatch = useDispatch()

  const me = useSelector(state => state.me.profile)
  const balance = useSelector(state => state.wallet.balance)
  const txList = useSelector(state => state.wallet.txList)
  const hasMore = useSelector(state => state.wallet.hasMore)
  const pageCount = useSelector(state => state.wallet.pageCount)

  useEffect(() => {
    if (me.id && (pageCount === 0 || fetch)) {
      if (fetch) {
        batch(() => {
          dispatch(setTxList([]))
          dispatch(setPageCount(0))
          dispatch(setHasMore(true))
        })
      }
      getBalance()
      getTx()
    }
  }, [me])

  const getBalance = async () => {
    const response = await axios.get(`http://localhost:9090/balances?id=${me.id}`)
    if (response.data.data[0]) {
      dispatch(setBalance(response.data.data[0].value))
    }
  }

  const getTx = async () => {
    const ITEM_LIMIT = 12
    const page = pageCount || 0

    const response = await axios.get(`http://localhost:9090/transactions?id=${me.id}&_skip=${page * ITEM_LIMIT}&_limit=${ITEM_LIMIT}`)

    const newTxList = response.data.data
    const newList = [...txList].concat(newTxList)
    batch(() => {
      dispatch(setTxList(newList))
      dispatch(setPageCount(page + 1))
    })
    if (newTxList.length === 0 && newTxList.length < ITEM_LIMIT) {
      dispatch(setHasMore(false))
    }
  }

  return (
    <Wallet me={me} balance={balance} txList={txList} getTx={getTx} hasMore={hasMore} />
  )
}

export default WalletScreen