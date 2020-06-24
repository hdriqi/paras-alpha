import Wallet from 'components/Wallet'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useEffect } from 'react'
import axios from 'axios'
import { setBalance, setWalletTxList, setWalletPageCount, setWalletHasMore } from 'actions/wallet'

const WalletScreen = ({ fetch = true }) => {
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
          dispatch(setWalletTxList([]))
          dispatch(setWalletPageCount(0))
          dispatch(setWalletHasMore(true))
        })
      }
      getBalance()
      getTx()
    }
  }, [me])

  const getBalance = async () => {
    const response = await axios.get(`${process.env.BASE_URL}/balances?id=${me.id}`)
    if (response.data.data[0]) {
      dispatch(setBalance(response.data.data[0].value))
    }
  }

  const getTx = async () => {
    const ITEM_LIMIT = 3
    const page = pageCount || 0

    const response = await axios.get(`${process.env.BASE_URL}/transactions?id=${me.id}&__skip=${page * ITEM_LIMIT}&__limit=${ITEM_LIMIT}&__sort=-createdAt`)

    const newTxList = response.data.data
    const newList = [...txList].concat(newTxList)
    batch(() => {
      dispatch(setWalletTxList(newList))
      dispatch(setWalletPageCount(page + 1))
    })
    if (newTxList.length === 0 && newTxList.length < ITEM_LIMIT) {
      dispatch(setWalletHasMore(false))
    }
  }

  return (
    <Wallet me={me} balance={balance} txList={txList} getTx={getTx} hasMore={hasMore} />
  )
}

export default WalletScreen