import { withRedux } from '../../lib/redux'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { addMementoList } from '../../actions/me'

import near from '../../lib/near'
import { setLoading } from '../../actions/ui'
import Image from '../Image'
import RichText from '../Input/RichText'
import NavTop from 'components/NavTop'
import Scrollbars from 'react-custom-scrollbars'
import Select from 'components/Input/Select'
import Alert from 'components/Utils/Alert'
import Pop from 'components/Pop'
import initials from 'initials'
import { dataURItoBlob } from 'lib/utils'
import ipfs from 'lib/ipfs'

const NewMemento = ({ onClose, onComplete, edit = false }) => {
  const me = useSelector(state => state.me.profile)
  const dispatch = useDispatch()
  const bodyRef = useRef(null)
  const backRef = useRef(null)
  const descRef = useRef(null)

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [descRaw, setDescRaw] = useState('')
  const [descBackground, setDescBackground] = useState('bg-dark-2')
  const [type, setType] = useState({
    value: 'public',
    label: 'public'
  })
  const [domain, setDomain] = useState({})

  const [showAlert, setShowAlert] = useState(false)

  const _validateSubmit = () => {
    if (
      (_validateName()) &&
      (!!domain.value) &&
      (!!type.value) &&
      (desc.length <= 150)) {
      return true
    }
    return false
  }

  const _validateName = () => {
    if (name.length === 0) return true
    return name.match(/^[a-zA-Z0-9]{1,30}$/)
  }

  useEffect(() => {
    if (bodyRef.current) {
      setDesc(bodyRef.current.value)
    }
  }, [descRaw])

  const _submit = async (e) => {
    e.preventDefault()
    var canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    var ctx = canvas.getContext('2d')

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = 'bold 288px Inconsolata'
    ctx.fillStyle = 'rgb(225, 49, 40)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(initials(name).toUpperCase(), canvas.width / 2, canvas.height / 2)

    const url = canvas.toDataURL('image/' + 'png')
    const blob = dataURItoBlob(url)
    let img = null
    for await (const file of ipfs.client.add([{
      content: blob
    }])) {
      img = {
        url: file.path,
        type: 'ipfs'
      }
    }

    const newData = {
      name: name,
      category: domain.value,
      img: img,
      desc: '',
      type: type.value
    }
    dispatch(setLoading(true, 'Creating memento...'))
    const m = await near.contract.createMemento(newData)

    dispatch(setLoading(false))
    dispatch(addMementoList([m]))
    if (typeof onComplete === 'function') {
      onComplete(m)
    }
    // setShowAlert(true)
    // try {
    //   const newData = {
    //     name: name,
    //     desc: desc,
    //     descRaw: desc,
    //     type: ype.value,
    //   }
    //   dispatch(setLoading(true, 'Creating memento...'))
    //   const m = await near.contract.createMemento(newData)

    //   const newLocalData = {
    //     ...m,
    //     ...{
    //       user: profile
    //     }
    //   }
    //   batch(() => {
    //     dispatch(setLoading(false))
    //     dispatch(addBlockList([newLocalData]))
    //   })

    //   _close()
    // } catch (err) {
    //   console.log(err)
    // }
  }

  const _descOnFocus = (e) => {
    setDescBackground('bg-dark-12')
  }
  const _descOnBlur = () => {
    setDescBackground('bg-dark-2')
  }

  const domainName = (type.value === 'personal' ? `${name || '[name]'}.${me.id.split('.')[0]}` : `${name || '[name]'}.${domain.value || '[domain]'}`).toLowerCase()

  return (
    <div id="new-memento" className="bg-dark-0 min-h-screen">
      <Alert
        show={showAlert}
        onClose={_ => setShowAlert(false)}
        mainText={`${domainName} is not available`}
      />
      <NavTop
        left={
          <Pop>
            <button>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M11.9991 13.0607L8.77941 16.2804L7.71875 15.2197L10.9384 12.0001L7.71875 8.78039L8.77941 7.71973L11.9991 10.9394L15.2187 7.71973L16.2794 8.78039L13.0597 12.0001L16.2794 15.2197L15.2187 16.2804L11.9991 13.0607V13.0607Z" fill="white" />
              </svg>
            </button>
          </Pop>
        }
        center={
          <h3 className="text-lg font-bold text-white px-2">New Memento</h3>
        }
        right={
          <button disabled={!_validateSubmit()} onClick={_submit}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
              <circle cx="16" cy="16" r="16" fill="#E13128" />
              <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
            </svg>
          </button>
        }
      />
      <div className="mt-8">
        <div className="px-4">
          <div className="text-center">
            <h4 className="text-white text">Create Memento</h4>
            <h4 className="text-white text-xl font-semibold break-words">{domainName}</h4>
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label className="block text-sm pb-1 font-semibold text-white">Name</label>
              <p className={`${name.length > 30 ? 'text-red-600 font-bold' : 'text-black-5'} text-sm`}>{name.length}/30</p>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" type="text" placeholder="Memento name" />
            {
              !_validateName() && (
                <div className="pt-1">
                  <p className="text-primary-4 text-sm">Memento name must only contain letters and numbers</p>
                </div>
              )
            }
          </div>
          <div className="mt-4">
            <label className="block text-sm pb-1 font-semibold text-white">Category</label>
            <Select
              onChange={setDomain}
              placeholder="Memento category"
              options={[
                { value: 'art', label: 'Art' },
                { value: 'com', label: 'Business' },
                { value: 'gg', label: 'Gaming' },
                { value: 'info', label: 'General' },
                { value: 'health', label: 'Health' },
                { value: 'life', label: 'Lifestyle' },
                { value: 'science', label: 'Science' },
                { value: 'sport', label: 'Sport' },
                { value: 'tech', label: 'Technology' },
                { value: 'travel', label: 'Travel' },
              ]}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm pb-1 font-semibold text-white">Type</label>
            <Select
              isSearchable={false}
              onChange={setType}
              placeholder="Memento type"
              options={[
                { value: 'public', label: 'Public' },
                { value: 'personal', label: 'Personal' }
              ]}
            />
          </div>
          {
            edit && (
              <div>
                <div className="mt-4">
                  <div ref={descRef} className="flex justify-between">
                    <label className="block text-sm pb-1 font-semibold text-white">Description</label>
                    <p className={`${desc.length > 150 ? 'text-red-600 font-bold' : 'text-black-5'} text-sm`}>{desc.length}/150</p>
                  </div>
                  <div className={`${descBackground} rounded-md h-32 p-2`}>
                    <Scrollbars>
                      <RichText
                        inputRef={bodyRef}
                        text={descRaw}
                        setText={setDescRaw}
                        placeholder="Memento description"
                        className="w-full"
                        suggestionsPortalHost={descRef.current}
                        onFocus={_descOnFocus}
                        onBlur={_descOnBlur}
                        style={{
                          suggestions: {
                            maxWidth: descRef && descRef.current ? `${descRef.current.clientWidth}px` : '100%'
                          }
                        }}
                      />
                    </Scrollbars>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default withRedux(NewMemento)