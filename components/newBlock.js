import { withRedux } from "../lib/redux"
import { useSelector, useDispatch } from "react-redux"
import { toggleNewBlock } from "../actions/ui"
import { useState } from "react"
import { addBlockList } from "../actions/me"

const NewBlock = () => {
  const showNewBlock = useSelector(state => state.ui.showNewBlock)
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

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

  const _submit = (e) => {
    e.preventDefault()

    const id = Math.random().toString(36).substr(2, 9)

    dispatch(addBlockList([
      {
        id: id,
        name: name,
        desc: desc
      }
    ]))

    _close()
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
            <h3 className="text-2xl font-bold text-black-1 tracking-tighter">New Block</h3>
          </div>
          <div className="absolute right-0">
            <button disabled={!_validateSubmit()} onClick={e => _submit(e)} className="text-2xl font-bold text-black-1 tracking-tighter">Done</button>
          </div>
        </div>
        <div>
          <div className="mt-8">
            <div>
              <label className="block text-sm pb-1 font-semibold text-black-2">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-sm" type="text" placeholder="Block name" />
            </div>
            <div className="mt-4">
              <label className="block text-sm pb-1 font-semibold text-black-2">Description</label>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} className="resize-none w-full h-40 transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 p-2 rounded-sm" placeholder="Block description (optional)"></textarea>
            </div>
          </div>
        </div>
      </div>
    ) : null
  ) 
}

export default withRedux(NewBlock)