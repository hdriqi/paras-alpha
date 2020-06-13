import { useRef, useEffect, useState } from "react"
import { RotateSpinLoader } from 'react-css-loaders'
import near from "lib/near"
import axios from 'axios'

const pieceList = [5, 10, 15, 20]

const ModalPiece = ({ show, onClose, onComplete, post }) => {
  const ref = useRef()
  const [chosenPiece, setChosenPiece] = useState(0)
  const [pieceDetail, setPieceDetail] = useState([])
  const [showDetail, setShowDetail] = useState(false)
  const [submitting, setSubmitting] = useState(false)

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

      let postOwnerQuota = 1
      let postMementoQuota = 0
      let postOriginalOwnerQuota = 0
      let postOriginalMementoQuota = 0
      if (memento) {
        postOwnerQuota = 90
        postMementoQuota = 10
        if (post.id != post.originalId) {
          const response = await axios.get(`http://localhost:9090/posts?id=${post.originalId}`)
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
    // todo check user wallet first
    setSubmitting(true)
    const value = chosenPiece * (10 ** 18)
    await near.contract.piecePost({
      postId: post.id,
      value: value.toString()
    })
    setSubmitting(false)
    onComplete()
  }
  
  return (
    <div className="container-confirm-modal-bg">
      {
        show ? (
          <div id="confirm-modal-bg" className="fixed inset-0 z-50 flex items-center" style={{
            backgroundColor: `rgba(0,0,0,0.86)`
          }}>
            <div ref={ref} className="max-w-sm m-auto w-full p-4">
              <div className="bg-dark-1 w-full rounded-md overflow-hidden">
                <div className="pt-4 text-center flex">
                  {
                    pieceList.map(piece => {
                      return (
                        <div className="w-1/4 flex items-center justify-center">
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
                      <p className="text-white">Send {chosenPiece} Ⓟ</p>
                      <div className="flex items-center justify-center py-2" onClick={_ => setShowDetail(!showDetail)}>
                        <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.70696 7.29267L15.9998 -0.000226974L17.4141 1.41399L8.70696 10.1211L-0.000150681 1.41399L1.41406 -0.000226974L8.70696 7.29267Z" fill="white" fill-opacity="0.6" />
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
                    <button onClick={onClose} className="hover:bg-dark-24 flex items-center justify-center w-full text-white font-semibold text-sm text-center p-2">
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
    </div>
  )
}

export default ModalPiece