import ParseBody from "./parseBody"
import { useState } from "react"
import axios from 'axios'
import { useSelector, useDispatch } from "react-redux"
import { withRedux } from "../lib/redux"
import Push from "./Push"
import Image from "./Image"
import near from "../lib/near"
import { setLoading } from "../actions/ui"

const ModalComment = ({ close, data, cb }) => {
  const [view, setView] = useState('default')
  const dispatch = useDispatch()

  const _closeModal = (e) => {
    if(e.target.id === 'modal-bg') {
      setView('default')
      close()
    }
  }

  const _delete = async (id) => {
    dispatch(setLoading(true, 'Forgetting comment...'))
    await near.contract.deleteCommentById({
      id: id
    })
    if(cb) {
      cb()
    }
    dispatch(setLoading(false))
    close()
  }

  return (
    (
      <div id="modal-bg" onClick={(e) => _closeModal(e)} className="fixed inset-0 w-full h-full z-40 p-8 pt-40" style={{
        backgroundColor: `rgba(0,0,0,0.5)`
      }}>
        <div className="max-w-sm m-auto bg-dark-0 shadow-lg rounded-lg">
          {
            view === 'default' && (
              <div>
                <button className="w-full p-4  font-medium text-left" onClick={_ => setView('confirmDelete')}>Forget</button>
              </div>
            )
          }
          {
            view === 'confirmDelete' && (
              <div>
                <p className="p-4">Do you want to forget this comment?</p>
                <div className="flex justify-end">
                  <button className="p-4 font-medium text-left" onClick={_ => setView('default')}>Cancel</button>
                  <button className="p-4 text-red-600 font-medium text-left"  onClick={_ => _delete(data.id)}>Forget</button>
                </div>
              </div>
            )
          }
          <div className="opacity-0 absolute">
            <input readOnly type="text" value={`http://localhost:3000/post/${data.id}`} id="urlLink" />
          </div>
        </div>
      </div>
    )
  )
}

const Comment = ({ comment }) => {
  const profile = useSelector(state => state.me.profile)
  const [isDeleted, setIsDeleted] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const cb = () => {
    setIsDeleted(true)
  }

  if(!comment.id) {
    return (
      <div>
        Loading
      </div>
    )
  }
  else if(isDeleted) {
    return null
  }
  else {
    return (
      <div className="flex items-center px-4 py-2 mt-4 bg-dark-0 shadow-subtle">
        <div className="w-10 rounded-full overflow-hidden">
          <Image className="object-cover w-full h-full" data={comment.user.imgAvatar} />
        </div>
        <div className="pl-4 w-full">
          <div className="flex w-full justify-between">
            <Push href="/[username]" as={`/${comment.user.username}`} props={{
              username: comment.user.username,
              user: comment.user
            }}>
              <p className="font-semibold text-black-1">{ comment.user.username }</p>
            </Push>
            {
              profile && profile.username === comment.user.username && (
                <svg onClick={_ => setShowModal(true)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12Z" fill="black"/>
                </svg>
              )
            }
          </div>
          <p className="text-black-3 text-sm"><ParseBody body={comment.bodyRaw} /></p>
        </div>
        {
          showModal && <ModalComment close={_ => setShowModal(false)} data={comment} cb={cb} />
        }
      </div>
    )
  }
}

export default withRedux(Comment)