import List from "components/Utils/List"
import { useState } from "react"
import { useDispatch, batch } from "react-redux"
import Notify from "components/Utils/Notify"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"

const ModalComment = ({ showModal, setShowModal, me, post, comment, onDelete }) => {
  const dispatch = useDispatch()
  const [showConfirmForget, setShowConfirmForget] = useState(false)

  const _deletePost = async () => {
    dispatch(setLoading(true, 'Forgetting the memory...'))
    await near.contract.deleteComment({
      id: comment.id
    })

    batch(() => {
      dispatch(setLoading(false))
    })
    setShowConfirmForget(false)
    setShowModal(false)
    onDelete()
  }

  const _forget = () => {
    setShowModal(false)
    setShowConfirmForget(true)
  }

  return (
    <div>
      <Confirm
        show={showConfirmForget}
        onClose={_ => setShowConfirmForget(false)}
        onComplete={_ => _deletePost()}
        leftText="Cancel"
        rightText="Remove"
        mainText="Remove this comment?"
      />
      <List show={showModal} onClose={_ => setShowModal(false)}>
        <div className="opacity-0 absolute" style={{
          zIndex: `-1`
        }}>
          <input readOnly type="text" value={`${window.location.origin}/post/${post.id}`} id={`urlLink_${post.id}`} />
        </div>
        <div>
          <div>
            <button className="w-full text-left" onClick={_ => setShowModal(false)}>
              <Push href="/[id]" as={`/${comment.owner}`} props={{
                id: comment.owner
              }}>
                <h4 className="p-4 text-white font-bold">View Profile</h4>
              </Push>
            </button>
            {
              ((me && me.id == post.owner) || (me && me.id == comment.owner)) && (
                <button className="w-full text-left" onClick={_ => _forget()}>
                  <h4 className="p-4 text-white font-bold">Forget</h4>
                </button>
              )
            }
          </div>
        </div>
      </List>
    </div>
  )
}

export default ModalComment