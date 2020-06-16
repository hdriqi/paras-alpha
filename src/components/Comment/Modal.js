import List from "components/Utils/List"
import { useState, useContext } from "react"
import { useDispatch, batch } from "react-redux"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"
import { NotifyContext } from "components/Utils/NotifyProvider"

const ModalComment = ({ showModal, setShowModal, me, post, comment, onDelete }) => {
  const dispatch = useDispatch()
  const useNotify = useContext(NotifyContext)
  const [showConfirmForget, setShowConfirmForget] = useState(false)

  const _deletePost = async () => {
    dispatch(setLoading(true, 'Forgetting the memory...'))
    try {
      await near.contract.deleteComment({
        id: comment.id
      })
      onDelete()
    } catch (err) {
      useNotify.setText('Something went wrong, try again later')
      useNotify.setShow(true, 2500)
    }
    setShowConfirmForget(false)
    setShowModal(false)
    batch(() => {
      dispatch(setLoading(false))
    })
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
          <input readOnly type="text" value={`${window.location.origin}/post/${comment.postId}`} id={`urlLink_${comment.postId}`} />
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
              ((me && post && me.id == post.owner) || (me && me.id == comment.owner)) && (
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