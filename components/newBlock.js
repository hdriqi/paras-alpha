import { withRedux } from "../lib/redux"
import { useSelector, useDispatch } from "react-redux"
import { toggleNewBlock } from "../actions/ui"
import { useState } from "react"
import { addBlockList } from "../actions/me"
import axios from 'axios'
import ReactDropdown from "react-dropdown"

const NewBlock = () => {
  const showNewBlock = useSelector(state => state.ui.showNewBlock)
  const profile = useSelector(state => state.me.profile)
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [type, setType] = useState('public')

  const _close = () => {
    setName('')
    setDesc('')
    dispatch(toggleNewBlock(!showNewBlock))
  }

  const _validateSubmit = () => {
    if(name.length > 0) {
      return true
    }
    return false
  }

  const _submit = async (e) => {
    e.preventDefault()

    const id = Math.random().toString(36).substr(2, 9)

    try {
      const newData = {
        id: id,
        name: name,
        desc: desc,
        type: type.value,
        userId: profile.id,
        createdAt: new Date().toISOString()
      }

      await axios.post('http://localhost:3004/blocks', newData) 

      dispatch(addBlockList([newData]))

      _close()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    showNewBlock ? (
      <div className="fixed bg-white inset-0 z-30 px-4">
        <div className="h-12 w-full flex items-center justify-center relative">
          <div className="absolute left-0">
            <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black-1 tracking-tighter">New Memento</h3>
          </div>
          <div className="absolute right-0">
            <button disabled={!_validateSubmit()} onClick={e => _submit(e)} className="text-2xl font-bold text-black-1 tracking-tighter">Done</button>
          </div>
        </div>
        <div>
          <div className="mt-8">
            <div>
              <label className="block text-sm pb-1 font-semibold text-black-2">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" type="text" placeholder="Memento name" />
            </div>
            <div className="mt-4">
              <label className="block text-sm pb-1 font-semibold text-black-2">Type</label>
              <ReactDropdown 
                arrowClosed={
                  <span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.293 7.29291L20.7072 8.70712L12.0001 17.4142L3.29297 8.70712L4.70718 7.29291L12.0001 14.5858L19.293 7.29291Z" fill="black"/>
                    </svg>
                  </span>
                }
                onChange={opt => setType(opt)}
                value={type}
                className="capitalize font-normal w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 rounded-md" 
                controlClassName="p-0 border-none py-2"
                placeholderClassName="px-2"
                options={['public', 'permissioned']} 
                placeholder="Memento type"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm pb-1 font-semibold text-black-2">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} className="resize-none w-full h-40 transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-md" placeholder="Memento description (optional)"></textarea>
            </div>
          </div>
        </div>
      </div>
    ) : null
  ) 
}

export default withRedux(NewBlock)