import { withRedux } from "../lib/redux"
import { useSelector, useDispatch, batch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { addBlockList } from "../actions/me"
import ReactDropdown from "react-dropdown"
import { Mention, MentionsInput } from "react-mentions"
import PopForward from "./PopForward"
import near from "../lib/near"
import { setLoading } from "../actions/ui"
import Image from "./Image"
import RichText from "./Input/RichText"

const NewBlock = () => {
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
    if((name.length > 0 && name.length <= 30) && (desc.length <= 150)) {
      return true
    }
    return false
  }

  useEffect(() => {
    if(bodyRef.current) {
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
        type: type.value,
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
    <div id="new-memento" className="fixed bg-dark-0 inset-0 z-30 px-4">
      <div className="h-12 w-full flex items-center justify-center relative">
        <div className="absolute left-0">
          <PopForward ref={backRef}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
            </svg>
          </PopForward>
        </div>
        <div>
          <h3 className="text-xl font-bold text-black-1 tracking-tighter">New Memento</h3>
        </div>
        <div className="absolute right-0">
          <button disabled={!_validateSubmit()} onClick={e => _submit(e)} className="text-xl font-bold text-black-1 tracking-tighter">Done</button>
        </div>
      </div>
      <div>
        <div className="mt-8">
          <div>
            <div className="flex justify-between">
            <label className="block text-sm pb-1 font-semibold text-black-2">Name</label>
              <p className={`${name.length > 30 ? 'text-red-600 font-bold' : 'text-black-5'} text-sm`}>{name.length}/30</p>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" placeholder="Memento name" />
          </div>
          {/* <div className="mt-4">
            <label className="block text-sm pb-1 font-semibold text-black-2">Type</label>
            <ReactDropdown 
              arrowClosed={
                <span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M19.293 7.29291L20.7072 8.70712L12.0001 17.4142L3.29297 8.70712L4.70718 7.29291L12.0001 14.5858L19.293 7.29291Z" fill="black"/>
                  </svg>
                </span>
              }
              onChange={opt => {
                setType(opt)
              }}
              value={type}
              className="capitalize font-normal w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 rounded-md" 
              controlClassName="p-0 border-none py-2"
              placeholderClassName="px-2"
              options={['public', 'permissioned']} 
              placeholder="Memento type"
            />
          </div> */}
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
              className="bg-dark-12 p-2"
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

export default withRedux(NewBlock)