import List from "components/Utils/List"
import { useState, useContext } from "react"
import { useDispatch, batch } from "react-redux"
import Notify from "components/Utils/Notify"
import Confirm from "components/Utils/Confirm"
import { setLoading } from "actions/ui"
import near from "lib/near"
import Push from "components/Push"
import { NotifyContext } from "components/Utils/NotifyProvider"

const ProfileModal = ({ showModal, setShowModal, me, user }) => {
  const useNotify = useContext(NotifyContext)
  const [showNotifyCopyLink, setShowNotifyCopyLink] = useState(false)
  const [showConfirmLogout, setShowConfirmLogout] = useState(false)

  const _copyLink = (e) => {
    var copyText = document.getElementById(`urlLink_${user.id}`)
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

  const _logout = () => {
    near.wallet.signOut()

    window.location.replace(window.location.origin + '/login')
  }

  return (
    <div>
      <Notify show={showNotifyCopyLink}>
        <p className="text-white p-2">Link copied!</p>
      </Notify>
      <Confirm
        show={showConfirmLogout}
        onClose={_ => setShowConfirmLogout(false)}
        onComplete={_ => _logout()}
        leftText="Cancel"
        rightText="Logout"
        mainText="Log out from Paras?"
      />
      {
        showModal && (
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
                <button className="w-full text-left" onClick={_ => setShowModal(false)}>
                  <Push href="/[id]/memento" as={`/${user.id}/memento`} props={{
                    id: user.id
                  }}>
                    <a>
                      <h4 className="p-4 text-white font-bold">View Memento</h4>
                    </a>
                  </Push>
                </button>
                {
                  me && me.id == user.id && (
                    <button className="w-full text-left" onClick={_ => setShowModal(false)}>
                      <Push href="/me/following" as="/me/following" props={{
                        id: user.id
                      }}>
                        <a>
                          <h4 className="p-4 text-white font-bold">View Following</h4>
                        </a>
                      </Push>
                    </button>
                  )
                }
                {
                  me && me.id == user.id && (
                    <button className="w-full text-left" onClick={_ => setShowModal(false)}>
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
                {
                  me && me.id == user.id && (
                    <button className="w-full text-left" onClick={_ => {
                      setShowModal(false)
                      setShowConfirmLogout(true)
                    }}>
                      <h4 className="p-4 text-white font-bold">Log out</h4>
                    </button>
                  )
                }
              </div>
            </div>
          </List>
        )
      }
    </div>
  )
}

export default ProfileModal