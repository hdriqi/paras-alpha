import NavTop from "components/NavTop"
import Pop from "components/Pop"
import { useState, useContext } from "react"
import Select from "components/Input/Select"
import axios from 'axios'
import near from "lib/near"
import Confirm from "components/Utils/Confirm"
import { NotifyContext } from "components/Utils/NotifyProvider"
import { setLoading } from "actions/ui"
import { useDispatch, batch } from "react-redux"
import Alert from "components/Utils/Alert"
import { prettyBalance } from "lib/utils"
import JSBI from 'jsbi'
import { setBalance } from "actions/wallet"

let timeout = null

const WalletSend = ({ balance }) => {
  const dispatch = useDispatch()
  const useNotify = useContext(NotifyContext)
  const [userList, setUserList] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [amount, setAmount] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [showInsufficientBalance, setShowInsufficientBalance] = useState(false)

  const _submit = async () => {
    const bnValue = JSBI.BigInt(amount * 10 ** 18)
    try {
      dispatch(setLoading(true, 'Sending coin...'))
      await near.contract.transfer({
        to: selectedUser.id,
        tokens: bnValue.toString(),
        msg: ''
      })
      useNotify.setText('Your coin has been sent successfully')
      useNotify.setShow(true, 2500)
    } catch (err) {
      useNotify.setText('Something went wrong, try again later')
      useNotify.setShow(true, 2500)
    }
    const bnBalance = JSBI.BigInt(balance)
    const newBalance = JSBI.subtract(bnBalance, bnValue)
    batch(() => {
      dispatch(setBalance(newBalance.toString()))
      dispatch(setLoading(false))
    })
    setShowConfirm(false)
  }

  const _validateSubmit = () => {
    if (
      amount.match(/^([0-9]+(\.[0-9]+)?)$/) &&
      amount > 0 &&
      selectedUser?.id
    ) {
      return true
    }
    return false
  }

  const _setValidateAmount = (val) => {
    const regex = /^([0-9]*(\.[0-9]+)?)$/
    if (val.match(regex)) {
      setAmount(val)
    }
  }

  const _getUser = async (query) => {
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      const response = await axios.get(`${process.env.BASE_URL}/users?id__re=${query}`)
      const userList = response.data.data
      const list = userList.map(m => ({
        label: m.id,
        value: m
      }))
      setUserList(list)
    }, 250);
  }

  const _onSelect = (opt) => {
    setSelectedUser(opt.value)
  }

  const _confirmSend = () => {
    const bnValue = JSBI.BigInt(amount * 10 ** 18)
    const bnBalance = JSBI.BigInt(balance)
    if (JSBI.greaterThanOrEqual(bnValue, bnBalance)) {
      setShowInsufficientBalance(true)
      return
    }
    setShowConfirm(true)
  }

  const msg = `Send ${amount} to ${selectedUser?.id}`

  return (
    <div className="bg-dark-0 min-h-screen pb-6">
      <Confirm
        show={showConfirm}
        leftText="Cancel"
        rightText="Send"
        mainText={msg}
        onClose={_ => setShowConfirm(false)}
        onComplete={_ => _submit()}
      />
      <Alert
        show={showInsufficientBalance}
        mainText={`Insufficient Balance (Available ${prettyBalance(balance)})`}
        onClose={_ => setShowInsufficientBalance(false)}
      />
      <NavTop
        left={
          <Pop>
            <a>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
              </svg>
            </a>
          </Pop>
        }
        center={
          <h3 className="text-white text-xl font-bold">Send PAC</h3>
        }
        right={
          <button disabled={!_validateSubmit()} onClick={_ => _confirmSend()}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
              <circle cx="16" cy="16" r="16" fill="#E13128" />
              <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
            </svg>
          </button>
        }
      />
      <div className="px-4 py-4">
        <div>
          <div className="flex justify-between">
            <label className="block text-sm pb-1 font-semibold text-white">To</label>
          </div>
          <div className="">
            <Select
              className="w-full rounded-md outline-none bg-dark-2 focus:bg-dark-16 text-white"
              placeholder="Search user"
              options={userList}
              onInputChange={_getUser}
              onChange={_onSelect}
            />
          </div>
          <div className="flex justify-between mt-4">
            <label className="block text-sm pb-1 font-semibold text-white">Amount</label>
          </div>
          <input value={amount} onInput={e => _setValidateAmount(e.target.value)} className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" type="number" placeholder="Amount to send" />
        </div>
      </div>
    </div>
  )
}

export default WalletSend