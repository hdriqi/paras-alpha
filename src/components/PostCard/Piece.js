import { useRef, useEffect, useState, useContext } from "react"
import { RotateSpinLoader } from 'react-css-loaders'
import near from "lib/near"
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux"
import { prettyBalance } from "lib/utils"
import Alert from "components/Utils/Alert"
import { NotifyContext } from "components/Utils/NotifyProvider"
import { setBalance } from "actions/wallet"
import JSBI from 'jsbi'
import ReactTooltip from "react-tooltip"

const pieceList = [5, 10, 15, 20]

const ModalPiece = ({ show, onClose, onComplete, post }) => {
  const ref = useRef()
  const dispatch = useDispatch()
  const useNotify = useContext(NotifyContext)
  const balance = useSelector(state => state.wallet.balance)
  const [chosenPiece, setChosenPiece] = useState(5)
  const [pieceDetail, setPieceDetail] = useState([])
  const [showDetail, setShowDetail] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const onClickEv = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose()
      }
    }
    if (show) {
      document.addEventListener('click', onClickEv)
    }

    return () => {
      document.removeEventListener('click', onClickEv)
    }
  }, [show])

  useEffect(() => {
    const updateDetail = async () => {
      const memento = post.memento
      let originalPost = null
      let originalMemento = null

      let postOwnerQuota = 100
      let postMementoQuota = 0
      let postOriginalOwnerQuota = 0
      let postOriginalMementoQuota = 0
      if (memento) {
        postOwnerQuota = 90
        postMementoQuota = 10
        if (post.id != post.originalId) {
          const response = await axios.get(`${process.env.BASE_URL}/posts?id=${post.originalId}`)
          originalPost = response.data.data[0]
          if (originalPost) {
            postOwnerQuota = 5
            postMementoQuota = 5
            postOriginalOwnerQuota = 90
            originalMemento = originalPost.memento
            if (originalMemento) {
              postOriginalOwnerQuota = 80
              postOriginalMementoQuota = 10
            }
          }
        }
      }
      const detail = []
      const forPostOwner = chosenPiece * (postOwnerQuota / 100)
      if (forPostOwner > 0) {
        const txt = `${forPostOwner} Ⓟ to ${post.owner} [Post Owner]`
        detail.push(txt)
      }
      const forMementoOwner = chosenPiece * (postMementoQuota / 100)
      if (!!memento && forMementoOwner > 0) {
        const txt = `${forMementoOwner} Ⓟ to ${memento.owner} [Memento Owner]`
        detail.push(txt)
      }
      const forOriginalOwner = chosenPiece * (postOriginalOwnerQuota / 100)
      if (!!originalPost && forOriginalOwner > 0) {
        const txt = `${forOriginalOwner} Ⓟ to ${originalPost.owner} [Original Post Owner]`
        detail.push(txt)
      }
      const forOriginalMemento = chosenPiece * (postOriginalMementoQuota / 100)
      if (!!originalMemento && forOriginalMemento > 0) {
        const txt = `${forOriginalMemento} Ⓟ to ${originalMemento.owner} [Original Memento Owner]`
        detail.push(txt)
      }
      setPieceDetail(detail)
    }
    updateDetail()
  }, [chosenPiece])

  const _submit = async () => {
    const bnValue = JSBI.BigInt(chosenPiece * 10 ** 18)
    const bnBalance = JSBI.BigInt(balance)
    if (JSBI.greaterThanOrEqual(bnValue, bnBalance)) {
      setShowAlert(true)
      return
    }
    setSubmitting(true)
    try {
      const latestBalance = await near.contract.piecePost({
        postId: post.id,
        value: bnValue.toString()
      })
      dispatch(setBalance(latestBalance))
      useNotify.setText('Your Piece has been sent successfully')
      useNotify.setShow(true, 2500)
      onComplete()
    } catch (err) {
      useNotify.setText('Something went wrong, try again later')
      useNotify.setShow(true, 2500)
    }
    setSubmitting(false)
  }

  const _bgClick = (e) => {
    if (e.target.id === 'confirm-modal-bg') {
      onClose()
    }
  }

  return (
    <div className="container-confirm-modal-bg">
      {
        show ? (
          <div id="confirm-modal-bg" onClick={e => _bgClick(e)} className="fixed inset-0 z-50 flex items-center" style={{
            backgroundColor: `rgba(0,0,0,0.86)`
          }}>
            <div className="max-w-sm m-auto w-full p-4">
              <div className="bg-dark-1 w-full rounded-md overflow-hidden">
                <div className="flex items-center px-4 py-2 bg-dark-4">
                  <div>
                    <p className="text-lg font-bold text-white">Send Piece</p>
                  </div>
                  <div className="px-2 text-white-2">
                    <a data-place="right" data-tip="Show your support of the content by giving the creator a piece of yours">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="fill-current" fillRule="evenodd" clipRule="evenodd" d="M1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM13.0036 13.9983H14.003V15.9983H10.003V13.9983H11.003V11.9983H10.003V9.99835H13.0036V13.9983ZM13.0007 7.99835C13.0007 8.55063 12.5528 8.99835 12.0003 8.99835C11.4479 8.99835 11 8.55063 11 7.99835C11 7.44606 11.4479 6.99835 12.0003 6.99835C12.5528 6.99835 13.0007 7.44606 13.0007 7.99835Z" />
                      </svg>
                    </a>
                    <ReactTooltip />
                  </div>
                </div>
                <div className="py-2">
                  <p className="text-white text-lg text-center">Available balance</p>
                  <p className="text-white text-3xl text-center">{prettyBalance(balance)} Ⓟ</p>
                </div>
                <div className="pt-4 text-center flex">
                  {
                    pieceList.map((piece, idx) => {
                      return (
                        <div className="w-1/4 flex items-center justify-center" key={idx}>
                          <button onClick={_ => setChosenPiece(piece)} className={
                            `${chosenPiece == piece ? 'bg-primary-5 text-white' : 'bg-transparent text-primary-5'} rounded-full w-12 h-12 border border-primary-5
                            `
                          }>
                            <p className="text-2xl">{piece}</p>
                          </button>
                        </div>
                      )
                    })
                  }
                </div>
                {
                  chosenPiece > 0 && (
                    <div className="pt-4 text-center">
                      <p className="text-white text-lg">Send {chosenPiece} Ⓟ</p>
                      <div className="flex items-center justify-center py-2" onClick={_ => setShowDetail(!showDetail)}>
                        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M8.70696 7.29267L15.9998 -0.000226974L17.4141 1.41399L8.70696 10.1211L-0.000150681 1.41399L1.41406 -0.000226974L8.70696 7.29267Z" fill="white" fillOpacity="0.6" />
                        </svg>
                      </div>
                      {
                        showDetail && (
                          <div className="text-left px-4 overflow-hidden">
                            {
                              pieceDetail.map(detail => {
                                return (
                                  <div>
                                    <p className="text-white truncate">{detail}</p>
                                  </div>
                                )
                              })
                            }
                          </div>
                        )
                      }
                    </div>
                  )
                }
                <hr className="border-dark-0 mt-4" />
                <div className="flex">
                  <div className="w-1/2 border-r border-dark-0">
                    <button onClick={onClose} className="hover:bg-dark-24 h-10 flex items-center justify-center w-full text-white font-semibold text-sm text-center p-2">
                      Cancel
                    </button>
                  </div>
                  <div className="w-1/2">
                    {
                      submitting ? (
                        <button className="bg-primary-5 h-10 flex items-center justify-center hover:bg-primary-7 w-full text-white font-semibold text-sm text-center p-2">
                          <RotateSpinLoader style={{
                            margin: `auto`
                          }} color="white" size={2} />
                        </button>
                      ) : (
                          <button onClick={_ => _submit()} className="bg-primary-5 h-10 hover:bg-primary-7 w-full text-white font-semibold text-sm text-center p-2">
                            Send
                          </button>
                        )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
      <Alert
        show={showAlert}
        mainText="You don't have enough coins Ⓟ"
        onClose={_ => setShowAlert(false)}
      />
    </div>
  )
}

export default ModalPiece