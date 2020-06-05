import { withRedux } from '../../lib/redux'
import { useSelector, useDispatch, batch } from 'react-redux'
import { useState, useRef, useEffect } from 'react'
import { addBlockList } from '../../actions/me'
import ReactDropdown from 'react-dropdown'
import { Mention, MentionsInput } from 'react-mentions'
import PopForward from '../PopForward'
import near from '../../lib/near'
import { setLoading } from '../../actions/ui'
import Image from '../Image'
import RichText from '../Input/RichText'
import NavTop from 'components/NavTop'
import Scrollbars from 'react-custom-scrollbars'
import Select from 'components/Input/Select'

const NewMemento = () => {
  const profile = useSelector(state => state.me.profile)
  const dispatch = useDispatch()
  const bodyRef = useRef()
  const backRef = useRef()

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [descRaw, setDescRaw] = useState('')
  const [type, setType] = useState({
    value: 'public',
    label: 'public'
  })

  const _getUsers = async (query, callback) => {
    if (!query) return
    const q = [`username_like:=${query}`]
    const userList = await near.contract.getUserList({
      query: q,
      opts: {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _limit: 10
      }
    })
    const list = userList.map(user => ({
      display: `@${user.username}`,
      id: user.id,
      imgAvatar: user.imgAvatar,
      username: user.username
    }))
    callback(list)
  }

  const _close = () => {
    backRef.current.click()
  }

  const _validateSubmit = () => {
    if ((name.length > 0 && name.length <= 30) && (desc.length <= 150)) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (bodyRef.current) {
      setDesc(bodyRef.current.value)
    }
  }, [descRaw])

  const _submit = async (e) => {
    e.preventDefault()

    try {
      const newData = {
        name: name,
        desc: desc,
        descRaw: desc,
        type: ype.value,
      }
      dispatch(setLoading(true, 'Creating memento...'))
      const m = await near.contract.createMemento(newData)

      const newLocalData = {
        ...m,
        ...{
          user: profile
        }
      }
      batch(() => {
        dispatch(setLoading(false))
        dispatch(addBlockList([newLocalData]))
      })

      _close()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div id="new-memento" className="bg-dark-0 min-h-screen">
      <NavTop
        left={
          <PopForward ref={backRef}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
              <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
            </svg>
          </PopForward>
        }
        center={
          <h3 className="text-lg font-bold text-white">New Post</h3>
        }
        right={
          <button disabled={!_validateSubmit()} onClick={_submit}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
              <circle cx="16" cy="16" r="16" fill="#E13128" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="white" />
            </svg>
          </button>
        }
      />
      <div className="mt-8">
        <div className="px-4">
          <div>
            <div className="flex justify-between">
              <label className="block text-sm pb-1 font-semibold text-white">Name</label>
              <p className={`${name.length > 30 ? 'text-red-600 font-bold' : 'text-black-5'} text-sm`}>{name.length}/30</p>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" type="text" placeholder="Memento name" />
            {/* <div className="pt-1">
              <p className="text-primary-4 text-sm opacity-0">Memento name must only contain letters and numbers</p>
            </div> */}
          </div>
          <div className="mt-4">
            <label className="block text-sm pb-1 font-semibold text-white">Domain</label>
            <Select
              placeholder="Memento domain"
              options={[
                { value: 'art', label: 'Art' },
                { value: 'business', label: 'Business' },
                { value: 'gaming', label: 'Gaming' },
                { value: 'general', label: 'General' },
                { value: 'health', label: 'Health' },
                { value: 'lifestyle', label: 'Lifestyle' },
                { value: 'science', label: 'Science' },
                { value: 'sport', label: 'Sport' },
                { value: 'technology', label: 'Technology' },
                { value: 'travel', label: 'Travel' },
              ]}
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between">
              <label className="block text-sm pb-1 font-semibold text-black-2">Description</label>
              <p className={`${desc.length > 150 ? 'text-red-600 font-bold' : 'text-black-5'} text-sm`}>{desc.length}/150</p>
            </div>
            <RichText
              inputRef={bodyRef}
              text={descRaw}
              setText={setDescRaw}
              placeholder="Memento description"
              className="bg-dark-2 p-2 rounded-md overflow-hidden"
              style={{
                height: `8rem`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default withRedux(NewMemento)