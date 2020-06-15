import List from "components/Utils/List"
import { useState, useContext } from "react"
import { useDispatch, batch } from "react-redux"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"
import { updatePost, deletePost } from "actions/entities"
import { NotifyContext } from "components/Utils/NotifyProvider"

const ModalPost = ({ showModal, setShowModal, me, meMementoList, post }) => {
  const dispatch = useDispatch()
  const useNotify = useContext(NotifyContext)
  const [showConfirmForget, setShowConfirmForget] = useState(false)
  const [showConfirmRedact, setShowConfirmRedact] = useState(false)

  const _deletePost = async () => {
    dispatch(setLoading(true, 'Forgetting the memory...'))
    await near.contract.deletePost({
      id: post.id
    })

    useNotify.setText('Post has been forgotten')
    useNotify.setShow(true)
    setTimeout(() => {
      useNotify.setShow(false)
    }, 2500)

    batch(() => {
      dispatch(deletePost(post.id))
      dispatch(setLoading(false))
    })
    setShowConfirmForget(false)
  }

  const _redactPost = async () => {
    dispatch(setLoading(true, 'Redacting the memory...'))
    const newPost = await near.contract.redactPost({
      id: post.id
    })
    // const newPost = post
    // newPost.mementoId = ''

    const updatedPost = {
      ...post,
      ...newPost
    }

    useNotify.setText('Post has been redacted')
    useNotify.setShow(true)
    setTimeout(() => {
      useNotify.setShow(false)
    }, 2500)

    batch(() => {
      dispatch(setLoading(false))
      dispatch(updatePost(updatedPost.id, updatedPost))
    })
    setShowConfirmRedact(false)
  }

  const _forget = () => {
    setShowModal(false)
    setShowConfirmForget(true)
  }

  const _redact = () => {
    setShowModal(false)
    setShowConfirmRedact(true)
  }

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
      <Confirm
        show={showConfirmRedact}
        onClose={_ => setShowConfirmRedact(false)}
        onComplete={_ => _redactPost()}
        leftText="Cancel"
        rightText="Redact"
        mainText={`Remove this memory from ${post.mementoId}?`}
      />
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
            <button className="w-full text-left" onClick={_ => setShowModal(false)}>
              <Push href="/post/[id]" as={`/post/${post.id}`} props={{
                id: post.id
              }}>
                <h4 className="p-4 text-white font-bold">View Detail</h4>
              </Push>
            </button>
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
            {
              me && me.id == post.owner && (
                <button className="w-full text-left" onClick={_ => _forget()}>
                  <h4 className="p-4 text-white font-bold">Forget</h4>
                </button>
              )
            }
            {
              meMementoList.findIndex(memento => memento.id === post.mementoId) > -1 && (
                <button className="w-full text-left" onClick={_ => _redact()}>
                  <h4 className="p-4 text-white font-bold">Redact</h4>
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