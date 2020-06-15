import ParseBody from "../parseBody"
import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { withRedux } from "../../lib/redux"
import Push from "../Push"
import Image from "../Image"
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import ModalComment from "./Modal"

TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

const Comment = ({ comment }) => {
  const dispatch = useDispatch()

  const me = useSelector(state => state.me.profile)
  const [isDeleted, setIsDeleted] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const _deleteComment = () => {
    setIsDeleted(true)
  }

  if (!comment.id) {
    return (
      <div>
        Loading
      </div>
    )
  }
  else if (isDeleted) {
    return null
  }
  else {
    return (
      <div className="bg-dark-2 rounded-md overflow-hidden mt-4">
        <ModalComment
          showModal={showModal}
          setShowModal={setShowModal}
          me={me}
          post={comment.post}
          comment={comment}
          onDelete={_deleteComment}
        />
        <div className="p-2">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden shadow-inner">
                <Push href="/[id]" as={`/${comment.owner}`} props={{
                  id: comment.owner,
                  user: comment.user
                }}>
                  <a>
                    <Image className="object-fill" data={comment.user.imgAvatar} />
                  </a>
                </Push>
              </div>
              <div className="ml-2">
                <Push href="/[id]" as={`/${comment.owner}`} props={{
                  id: comment.owner,
                  user: comment.user
                }}>
                  <a>
                    <h4 className="text-white font-bold text-sm">{comment.owner}</h4>
                  </a>
                </Push>
                <p className="text-white opacity-60 text-xs">
                  {timeAgo.format(new Date(comment.createdAt / (10 ** 6)))}
                </p>
              </div>
            </div>
            <button onClick={_ => setShowModal(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="#E2E2E2" />
                <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#E2E2E2" />
                <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="#E2E2E2" />
              </svg>
            </button>
          </div>
          <p className="text-white pt-2"><ParseBody body={comment.body} /></p>
        </div>
      </div>
    )
  }
}

export default withRedux(Comment)