import List from "components/Utils/List"
import { useState } from "react"
import { useDispatch, batch } from "react-redux"
import Notify from "components/Utils/Notify"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"

const MementoModal = ({ showModal, setShowModal, me, memento = {} }) => {
  const dispatch = useDispatch()
  const [showNotifyCopyLink, setShowNotifyCopyLink] = useState(false)
  const [showConfirmForget, setShowConfirmForget] = useState(false)

  const _deleteMemento = async () => {
    dispatch(setLoading(true, 'Forgetting memento...'))
    await near.contract.deleteMemento({
      id: memento.id
    })

    batch(() => {
      // dispatch(deletePost(id))
      dispatch(setLoading(false))
    })
    setShowConfirmForget(false)
  }

  const _forget = () => {
    setShowModal(false)
    setShowConfirmForget(true)
  }

  const _copyLink = (e) => {
    var copyText = document.getElementById(`urlLink_${memento.id}`)
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
        onComplete={_ => _deleteMemento()}
        leftText="Cancel"
        rightText="Forget"
        mainText="Forget this memento?"
      />
      <List show={showModal} onClose={_ => setShowModal(false)}>
        <div className="opacity-0 absolute" style={{
          zIndex: `-1`
        }}>
          <input readOnly type="text" value={`${window.location.origin}/m/${memento.id}`} id={`urlLink_${memento.id}`} />
        </div>
        <div>
          <div>
            <button className="w-full text-left" onClick={_ => _copyLink()}>
              <h4 className="p-4 text-white font-bold">Copy Link</h4>
            </button>
            {
              me && me.id == memento.owner && (
                <button className="w-full text-left" onClick={_ => setShowModal(false)}>
                  <Push href="/m/[id]/edit" as={`/m/${memento.id}/edit`} props={{
                    id: memento.id,
                    memento: memento
                  }}>
                    <a>
                      <h4 className="p-4 text-white font-bold">Edit Memento</h4>
                    </a>
                  </Push>
                </button>
              )
            }
            {
              me && me.id == memento.owner && (
                <button className="w-full text-left" onClick={_ => _forget()}>
                  <a>
                    <h4 className="p-4 text-white font-bold">Forget Memento</h4>
                  </a>
                </button>
              )
            }
          </div>
          {/* {
          view === 'default' && (
            <div>
              <button className="w-full p-4 font-medium text-left" onClick={_ => _copyLink()}>Copy Link</button>
              {
                (me && me.id == post.user.id || meMementoList.findIndex(memento => memento.id === post.mementoId) > -1) && (
                  <button className="w-full p-4  font-medium text-left" onClick={_ => setView('confirmDelete')}>Forget</button>
                )
              }
            </div>
          )
        }
        {
          view === 'confirmDelete' && (
            <div>
              <p className="p-4">Do you want to forget this memory?</p>
              <div className="flex justify-end">
                <button className="p-4 font-medium text-left" onClick={_ => setView('default')}>Cancel</button>
                <button className="p-4 text-red-600 font-medium text-left" onClick={_ => _delete(post.id)}>Forget</button>
              </div>
            </div>
          )
        }
        {
          view === 'confirmCopyLink' && (
            <div>
              <p className="p-4">Link copied!</p>
            </div>
          )
        } */}
        </div>
      </List>
    </div>
  )
}

export default MementoModal