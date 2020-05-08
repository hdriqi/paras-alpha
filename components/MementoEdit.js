import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import ReactDropdown from 'react-dropdown'
import { Mention, MentionsInput } from "react-mentions"
import PopForward from "./PopForward"

const MementoEdit = ({ memento = {} }) => {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [type, setType] = useState('')
  const bodyRef = useRef()
  const backBtnRef = useRef()

  const _getUsers = async (query, callback) => {
    if (!query) return
    const response = await axios.get(`http://localhost:3004/users?username_like=${query}`)
    const list = response.data.map(user => ({ display: `@${user.username}`, id: user.id }))
    callback(list)
  }

  const _submit = async (e) => {
    e.preventDefault()

    try {
      const newData = {
        ...memento,
        ...{
          name: name,
          type: type.value,
          desc: bodyRef.current.value,
          descRaw: desc,
          updatedAt: new Date().toISOString()
        }
      }

      await axios.put(`http://localhost:3004/blocks/${memento.id}`, newData)
    } catch (err) {
      console.log(err)
    }

    backBtnRef.current.click()
  }

  useEffect(() => {
    if(memento.id) {
      setName(memento.name)
      setDesc(memento.desc)
      setType({
        label: memento.type,
        value: memento.type
      })
    }
  }, [memento])

  return (
    <div className="bg-white-1 min-h-screen">
      <div className="pb-12">
        <div className="fixed bg-white shadow-subtle top-0 left-0 right-0 h-12 px-4 z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute left-0">
              <PopForward ref={backBtnRef}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
                </svg>
              </PopForward>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Edit Memento</h3>
            </div>
            <div className="absolute right-0">
              <h3 onClick={e => _submit(e)} className="text-2xl font-bold text-black-1 tracking-tighter">Save</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="py-6">
        <div className="bg-white">
          <div className="mt-4">
            <label>Name</label>
            <input className="mt-2 bg-gray-200 w-full p-2 rounded-md" type="text" value={name} onChange={e => setName(e.target.value)} />
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
              className="font-normal w-full transition-all duration-300 text-black-3 leading-normal outline-none border border-black-6 focus:border-black-4 rounded-md" 
              controlClassName="p-0 border-none py-2"
              placeholderClassName="capitalize px-2"
              options={['public', 'permissioned']} 
              placeholder="Memento type"
            />
          </div>
          <div className="mt-4">
            <label>Description</label>
            <MentionsInput className="outline-none break-words bg-gray-200 w-full rounded-md" style={{
              }} 
                style={{
                  control: {
                    fontSize: `16px`,
                    fontWeight: `500`,
                  },
                  input: {
                    margin: 0,
                    padding: `.5rem`,
                    overflow: `auto`,
                    height: `5.5rem`,
                  },
                  suggestions: {
                    list: {
                      backgroundColor: 'white',
                      border: '1px solid rgba(0,0,0,0.15)',
                      fontSize: 14,
                    },
                    item: {
                      padding: '.5rem',
                      borderBottom: '1px solid rgba(0,0,0,0.15)',
                
                      '&focused': {
                        backgroundColor: '#DFDFDF',
                      },
                    },
                  },
                }}
                placeholder="Tell us about yourself" 
                onChange={e => setDesc(e.target.value)} 
                value={desc}
                allowSuggestionsAboveCursor={true}
                inputRef={bodyRef}
              >
                <Mention
                  trigger="@"
                  data={_getUsers}
                  appendSpaceOnAdd={true}
                />
              </MentionsInput>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MementoEdit