import List from "components/Utils/List"
import { useState } from "react"
import { useDispatch, batch } from "react-redux"
import Notify from "components/Utils/Notify"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"

const ProfileModal = ({ showModal, setShowModal, me, user }) => {
  const dispatch = useDispatch()
  const [showNotifyCopyLink, setShowNotifyCopyLink] = useState(false)
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)

  const _copyLink = (e) => {
    var copyText = document.getElementById(`urlLink_${user.id}`)
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
        show={showConfirmLogout}
        onClose={_ => setShowConfirmLogout(false)}
        onComplete={_ => _deletePost()}
        leftText="Cancel"
        rightText="Logout"
        mainText="Log out from Paras?"
      />
      <List show={showModal} onClose={_ => setShowModal(false)}>
        <div className="opacity-0 absolute" style={{
          zIndex: `-1`
        }}>
          <input readOnly type="text" value={`${window.location.origin}/${user.id}`} id={`urlLink_${user.id}`} />
        </div>
        <div>
          <div>
            <button className="w-full text-left" onClick={_ => _copyLink()}>
              <h4 className="p-4 text-white font-bold">Copy Link</h4>
            </button>
            {
              me && me.id == user.id && (
                <button className="w-full text-left">
                  <Push href="/me/edit" as="/me/edit" props={{
                    id: user.id,
                    user: user
                  }}>
                    <a>
                      <h4 className="p-4 text-white font-bold">Edit Profile</h4>
                    </a>
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

export default ProfileModal