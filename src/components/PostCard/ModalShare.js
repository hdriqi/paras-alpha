import List from "components/Utils/List"
import { useState, useContext, useEffect } from "react"
import { NotifyContext } from "components/Utils/NotifyProvider"
import Push from "components/Push"

const ModalShare = ({ showModal, setShowModal, post }) => {
  const useNotify = useContext(NotifyContext)

  useEffect(() => {
    window.Sharer.init()
  }, [showModal])

  const _copyLink = (e) => {
    var copyText = document.getElementById(`urlLink_${post.id}`)
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    document.execCommand('copy')
    useNotify.setText('Link copied!')
    useNotify.setShow(true)
    setShowModal(false)
    setTimeout(() => {
      useNotify.setShow(false)
    }, 1500)
  }

  return (
    <div>
      <List show={showModal} onClose={_ => setShowModal(false)}>
        <div className="opacity-0 absolute" style={{
          zIndex: `-1`
        }}>
          <input readOnly type="text" value={`${window.location.origin}/post/${post.id}`} id={`urlLink_${post.id}`} />
        </div>
        <div>
          <div>
            <button className="w-full text-left" onClick={_ => _copyLink()}>
              <h4 className="p-4 text-white font-bold">Copy Link</h4>
            </button>
            <Push href="/post/[id]/memento" as={`/post/${post.id}/memento`} props={{
              id: post.id
            }}>
              <button className="w-full text-left">
                <h4 className="p-4 text-white font-bold">Transmit</h4>
              </button>
            </Push>
            <button className="w-full text-left" data-sharer="facebook" data-url={`${window.location.origin}/post/${post.id}`}>
              <h4 className="p-4 text-white font-bold">Share to Facebook</h4>
            </button>
            <button className="w-full text-left" data-sharer="twitter" data-url={`${window.location.origin}/post/${post.id}`}>
              <h4 className="p-4 text-white font-bold">Share to Twitter</h4>
            </button>
          </div>
        </div>
      </List>
    </div>
  )
}

export default ModalShare