import WalletSend from 'components/Wallet/send'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import axios from 'axios'

const WalletSendScreen = () => {
  const me = useSelector(state => state.me.profile)
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    if (me.id) {
      getBalance()
    }
  }, [me])

  const getBalance = async () => {
    const response = await axios.get(`${process.env.BASE_URL}/balances/${me.id}`)
    setBalance(response.data.data)
  }
  return (
    <WalletSend balance={balance} />
  )
}

export default WalletSendScreen