import Push from "components/Push"

const ModalLogin = ({ show, onClose }) => {
  const _bgClick = (e) => {
    if (e.target.id === 'confirm-modal-bg') {
      onClose()
    }
  }

  return (
    <div className="container-confirm-modal-bg">
      {
        show ? (
          <div id="confirm-modal-bg" onClick={e => _bgClick(e)} className="fixed inset-0 z-50 flex items-center" style={{
            backgroundColor: `rgba(0,0,0,0.86)`
          }}>
            <div className="max-w-sm m-auto w-full p-4">
              <div className="bg-dark-1 w-full rounded-md overflow-hidden">
                <div className="p-4 text-center">
                  <p className="text-white">Login to Continue</p>
                  <Push href="/login" as="/login">
                    <a>
                      <button className="mt-4 w-full rounded-md p-2 bg-primary-5 text-white font-semibold">Login</button>
                    </a>
                  </Push>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
}

export default ModalLogin