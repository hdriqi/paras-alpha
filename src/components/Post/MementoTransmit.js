import { useState, useEffect } from 'react'
import axios from 'axios'
import { RotateSpinLoader } from 'react-css-loaders'
import Confirm from 'components/Utils/Confirm'
import Select from 'components/Input/Select'
import near from 'lib/near'
import { useSelector } from 'react-redux'
import Alert from 'components/Utils/Alert'

let timeout

const MementoTransmit = ({ left, right, post, currentTransmitList }) => {
  const [err, setErr] = useState(false)
  const me = useSelector(state => state.me.profile)
  const [chosenMemento, setChosenMemento] = useState({})
  const [searchMemento, setSearchMemento] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showAlert2, setShowAlert2] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const onKeydown = e => {
      if (e.key === "Escape") {
        _left()
      }
    }
    document.addEventListener('keydown', onKeydown)

    return () => {
      document.removeEventListener('keydown', onKeydown)
    }
  }, [chosenMemento])

  const _validateSubmit = () => {
    if (chosenMemento.value) {
      return true
    }
    return false
  }

  const validateSelect = (opt) => {
    if (opt.value) {
      if (opt.value.type === 'personal' && opt.value.owner !== me.id) {
        setShowAlert(true)
        return false
      }
      if (currentTransmitList.findIndex(m => m.id === opt.value.id) > -1) {
        setShowAlert2(true)
        return false
      }
    }
    return true
  }

  const _selectMemento = (opt) => {
    setChosenMemento(opt)
  }

  const _right = async () => {
    setLoading(true)
    const newPost = await near.contract.transmitPost({
      id: post.id,
      mementoId: chosenMemento.value.id
    })
    setLoading(false)
    right(newPost)
  }

  const _left = () => {
    if (chosenMemento.value) {
      setShowConfirm(true)
    }
    else {
      left()
    }
  }

  const _bgClick = (e) => {
    if (e.target.id === 'new-modal-bg') {
      _left()
    }
  }

  const _getMemento = async (query) => {
    clearTimeout(timeout)
    timeout = setTimeout(async () => {
      const response = await axios.get(`http://localhost:9090/mementos?id_like=${query}`)
      const mementoList = response.data.data
      const list = mementoList.map(m => ({
        label: m.id,
        value: m
      }))
      setSearchMemento(list)
    }, 250);
  }

  const title = 'Transmit to'

  return (
    <div id="new-modal-bg" onClick={e => _bgClick(e)} className="fixed inset-0 z-50 flex items-center" style={{
      backgroundColor: `rgba(0,0,0,0.86)`
    }}>
      <Alert
        show={showAlert}
        onClose={() => {
          setShowAlert(false)
        }}
        mainText="You cannot write to this Memento"
      />
      <Alert
        show={showAlert2}
        onClose={() => {
          setShowAlert2(false)
        }}
        mainText="This post is already transmitted into this Memento"
      />
      <Confirm
        show={showConfirm}
        onClose={_ => setShowConfirm(false)}
        onComplete={_ => {
          setShowConfirm(false)
          left()
        }}
        mainText="Discard current change?"
        leftText="Cancel"
        rightText="Discard"
      />
      <div className="max-w-sm m-auto p-4 w-full">
        <div className="bg-dark-1 w-full rounded-md">
          <div className="flex justify-between items-center w-full h-12 bg-dark-12 px-2 rounded-t-md">
            <div className="w-8 text-white flex items-center">
              <button onClick={_ => _left()}>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z" fill="white" />
                </svg>
              </button>
            </div>
            <div className="flex-auto text-white font-bold overflow-hidden px-2">{title}</div>
            <div className="w-8 text-white flex items-center justify-end">
              {
                !loading ? (
                  <button disabled={!_validateSubmit()} className="ml-auto" onClick={e => _right(e)}>
                    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                      <circle cx="16" cy="16" r="16" fill="#E13128" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
                    </svg>
                  </button>
                ) : (
                    <RotateSpinLoader style={{
                      marginLeft: `auto`,
                      marginRight: 0
                    }} color="#e13128" size={2.4} />
                  )
              }
            </div>
          </div>
          <div className="w-full rounded-b-md">
            <div className={`
                ${err && 'animated shake'}
                flex items-center h-full
              `}>
              <Select
                className="w-full"
                placeholder="Search memento"
                options={searchMemento}
                beforeSelect={validateSelect}
                onInputChange={_getMemento}
                onChange={_selectMemento}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MementoTransmit