import List from "components/Utils/List"
import { useState, useContext } from "react"
import { useDispatch, batch } from "react-redux"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"
import { entititesDeleteMemento } from "actions/entities"
import { useRouter } from "next/router"
import { NotifyContext } from "components/Utils/NotifyProvider"

const MementoModal = ({ showModal, setShowModal, me, memento = {} }) => {
  const useNotify = useContext(NotifyContext)
  const dispatch = useDispatch()
  const router = useRouter()
  const [showConfirmForget, setShowConfirmForget] = useState(false)

  const _deleteMemento = async () => {
    dispatch(setLoading(true, 'Forgetting memento...'))
    try {
      await near.contract.deleteMemento({
        id: memento.id
      })
      useNotify.setText('Memento has been forgotten')
      useNotify.setShow(true, 2500)

      batch(() => {
        dispatch(entititesDeleteMemento(memento.id))
      })
      // notify and back
      router.back()
    } catch (err) {
      useNotify.setText('Something went wrong, try again later')
      useNotify.setShow(true, 2500)
    }
    dispatch(setLoading(false))
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

    useNotify.setText('Link copied!')
    useNotify.setShow(true)
    setTimeout(() => {
      useNotify.setShow(false)
    }, 1500)

    setShowModal(false)
  }

  return (
    <div>
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
                      <h4 className="p-4 text-white font-bold">Edit</h4>
                    </a>
                  </Push>
                </button>
              )
            }
            {
              me && me.id == memento.owner && (
                <button className="w-full text-left" onClick={_ => _forget()}>
                  <a>
                    <h4 className="p-4 text-white font-bold">Forget</h4>
                  </a>
                </button>
              )
            }
          </div>
        </div>
      </List>
    </div>
  )
}

export default MementoModal