import propType from 'prop-types'
import { useEffect } from 'react'

const Alert = ({ show, onClose, onComplete, mainText }) => {
  useEffect(() => {
    const onKeydown = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
      else if (e.key === 'Enter') {
        onComplete()
      }
    }
    if(show) {
      document.addEventListener('keydown', onKeydown)
    }

    return () => {
      document.removeEventListener('keydown', onKeydown) 
    }
  }, [show])

  const _bgClick = (e) => {
    if (e.target.id === 'confirm-modal-bg') {
      onClose()
    }
  }

  return show ? (
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
            <div className="w-full">
              <button onClick={onClose} className="hover:bg-dark-24 w-full text-white font-semibold text-sm text-center p-2">
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null
}

Alert.propTypes = {
  show: propType.bool.isRequired,
  onClose: propType.func.isRequired,
  mainText: propType.string.isRequired,
}

export default Alert