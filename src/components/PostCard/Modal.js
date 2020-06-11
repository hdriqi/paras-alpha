import List from "components/Utils/List"
import { useState } from "react"
import { useDispatch, batch } from "react-redux"
import Notify from "components/Utils/Notify"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"

const ModalPost = ({ showModal, setShowModal, me, meMementoList, post }) => {
  const dispatch = useDispatch()
  const [showNotifyCopyLink, setShowNotifyCopyLink] = useState(false)
  const [showConfirmForget, setShowConfirmForget] = useState(false)

  const _deletePost = async () => {
    dispatch(setLoading(true, 'Forgetting memory...'))
    await near.contract.deletePost({
      id: post.id
    })

    batch(() => {
      dispatch(deletePost(id))
      dispatch(setLoading(false))
    })
    setShowConfirmForget(false)
  }

  const _forget = () => {
    setShowModal(false)
    setShowConfirmForget(true)
  }

  const _copyLink = (e) => {
    var copyText = document.getElementById(`urlLink_${post.id}`)
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy")
    setShowNotifyCopyLink(true)
    setShowModal(false)
    setTimeout(() => {
      setShowNotifyCopyLink(false)
    }, 1000)
  }

  return (
    <div>
      <Notify show={showNotifyCopyLink}>
        <p className="text-white p-2">Link copied!</p>
      </Notify>
      <Confirm
        show={showConfirmForget}
        onClose={_ => setShowConfirmForget(false)}
        onComplete={_ => _deletePost()}
        leftText="Cancel"
        rightText="Forget"
        mainText="Forget this memory?"
      />
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
            {
              (me && me.id == post.owner || meMementoList.findIndex(memento => memento.id === post.mementoId) > -1) && (
                <button className="w-full text-left" onClick={_ => _forget()}>
                  <h4 className="p-4 text-white font-bold">Forget</h4>
                </button>
              )
            }
            {
              me && me.id == post.owner && (
                <button className="w-full text-left" onClick={_ => setShowModal(false)}>
                  <Push href="/post/[id]/edit" as={`/post/${post.id}/edit`} props={{
                    id: post.id
                  }}>
                    <h4 className="p-4 text-white font-bold">Edit</h4>
                  </Push>
                </button>
              )
            }
          </div>
        </div>
      </List>
    </div>
  )
}

export default ModalPost