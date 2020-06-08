import propType from 'prop-types'
import { useEffect } from 'react'
import { enableBodyScroll, disableBodyScroll } from 'body-scroll-lock'

const Confirm = ({ show, onClose, onComplete, mainText, leftText, rightText }) => {
  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
      else if (e.key === 'Enter') {
        onComplete()
      }
    }
    if (show) {
      document.addEventListener('keydown', onKeydown)
    }

    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }, [show])

  useEffect(() => {
    if (show) {
      disableBodyScroll(document.querySelector('.container-confirm-modal-bg'), {
        reserveScrollBarGap: true,
      })
    }
    else {
      enableBodyScroll(document.querySelector('.container-confirm-modal-bg'))
    }
  }, [show])

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
            backgroundColor: `rgba(0,0,0,0.8)`
          }}>
            <div className="max-w-xs m-auto w-full p-4">
              <div className="bg-dark-1 w-full rounded-md overflow-hidden">
                <div className="p-4 text-center">
                  <p className="text-white">{mainText}</p>
                </div>
                <hr className="border-dark-24" />
                <div className="flex">
                  <div className="w-1/2 border-r border-dark-24">
                    <button onClick={onClose} className="hover:bg-dark-24 w-full text-white font-semibold text-sm text-center p-2">
                      {leftText}
                    </button>
                  </div>
                  <div className="w-1/2">
                    <button onClick={onComplete} className="hover:bg-dark-24 w-full text-white font-semibold text-sm text-center p-2">
                      {rightText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
    </div>
  )
}

Confirm.propTypes = {
  onClose: propType.func.isRequired,
  onComplete: propType.func.isRequired,
  mainText: propType.string.isRequired,
  leftText: propType.string.isRequired,
  rightText: propType.string.isRequired
}

export default Confirm