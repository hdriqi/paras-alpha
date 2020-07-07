import NavTop from 'components/NavTop'
import { useEffect, useState, Fragment, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import Scrollbars from 'react-custom-scrollbars'
import NewMemento from 'components/NewMemento'
import Push from 'components/Push'
import Pop from 'components/Pop'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import Image from 'components/Image'
import axios from 'axios'
import Alert from 'components/Utils/Alert'

const Distribute = ({ onClose, onSelect }) => {
  const router = useRouter()
  const me = useSelector(state => state.me.profile)
  const mementoList = useSelector(state => state.me.mementoList)
  const [searchMemento, setSearchMemento] = useState('')
  const [searchMementoList, setSearchMementoList] = useState([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')

  const _getMemento = async (query) => {
    const response = await axios.get(`${process.env.BASE_URL}/mementos?id__re=${query}`)
    setSearchMementoList(response.data.data)
  }

  useEffect(() => {
    if (searchMemento.length > 0) {
      _getMemento(searchMemento)
    }
  }, [searchMemento])

  const _createMementoOnComplete = (data) => {
    router.back()
  }

  const NewMementoComp = () => {
    return (
      <NewMemento
        onComplete={_createMementoOnComplete}
      />
    )
  }

  const _onSelect = (m) => {
    if (m.isArchive) {
      setAlertMsg('You cannot write to Archived Memento')
      setShowAlert(true)
      return
    }
    if (m.type === 'personal' && m.owner !== me.id) {
      setAlertMsg("You cannot write to this Memento")
      setShowAlert(true)
      return
    }
    onSelect(m)
  }

  return (
    <Fragment>
      <div id="new-post-distribute" className="min-h-screen bg-dark-0">
        <Alert 
          show={showAlert}
          onClose={() => {
            setShowAlert(false)
          }}
          mainText={alertMsg}
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
            <h3 className="text-lg font-bold text-white px-2">Choose a Memento</h3>
          }
          right={
            <Push
              href="/new/memento"
              as="/new/memento"
              component={NewMementoComp}
            >
              <button>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15" fill="#E13128" stroke="#E13128" strokeWidth="2" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.5408 22.3337V17.4598H9.66699V14.5408H14.5408V9.66699H17.4598V14.5408H22.3337V17.4598H17.4598V22.3337H14.5408Z" fill="white" />
                </svg>
              </button>
            </Push>
          }
        />
        <div className="px-4 py-4">
          <input className="mb-4 w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-16 text-white" type="text" value={searchMemento} onChange={e => setSearchMemento(e.target.value)} placeholder="Search" />
          {
            searchMemento.length === 0 ? (
              <div>
                <h3 className="text-lg font-bold text-white">My Memento</h3>
                <div>
                  {
                    mementoList.length > 0 ? (
                      mementoList.sort((a, b) => a.id.localeCompare(b.id)).map(m => {
                        return (
                          <div key={m.id} onClick={_ => _onSelect(m)} className="flex items-center my-2 bg-dark-2 rounded-md p-2 cursor-pointer hover:bg-dark-24">
                            <div className="flex w-4/5">
                              <div className="w-6 h-6 rounded-sm overflow-hidden">
                                {
                                  m.img ? (
                                    <Image data={m.img} />
                                  ) : (
                                      <div className="bg-white flex items-center justify-center">
                                        <p className="text-primary-5 font-extrabold">{m.id}</p>
                                      </div>
                                    )
                                }
                              </div>
                              <h4 className="ml-2 font-bold text-white truncate">{m.id}</h4>
                            </div>
                            <div className="w-1/5 text-right">
                              <h4 className="text-primary-5 uppercase text-xs tracking-wide">{m.type}</h4>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                        <div className="text-center mt-2 p-2 ">
                          <h4 className="text-white text-lg font-semibold">Empty Memento</h4>
                          <p className="text-white-1 pt-2">Click on button at top right to add Memento</p>
                        </div>
                      )
                  }
                </div>
              </div>
            ) : (
                <div>
                  <h3 className="text-lg font-bold text-white">Search Memento</h3>
                  <div>
                    {
                      searchMementoList.length > 0 ? (
                        searchMementoList.map(m => {
                          return (
                            <div key={m.id} onClick={_ => _onSelect(m)} className="flex items-center my-2 bg-dark-2 rounded-md p-2 cursor-pointer hover:bg-dark-24">
                              <div className="flex w-4/5">
                                <div className="w-6 h-6 rounded-sm overflow-hidden">
                                  {
                                    m.img ? (
                                      <Image data={m.img} />
                                    ) : (
                                        <div className="bg-white flex items-center justify-center">
                                          <p className="text-primary-5 font-extrabold">{m.id}</p>
                                        </div>
                                      )
                                  }
                                </div>
                                <h4 className="ml-2 font-bold text-white truncate">{m.id}</h4>
                              </div>
                              <div className="w-1/5 text-right">
                                <h4 className="text-primary-5 uppercase text-xs tracking-wide">{m.type}</h4>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                          <div className="text-center mt-2 p-2 ">
                            <h4 className="text-white text-lg font-semibold">No Memento Found</h4>
                            <p className="text-white-1 pt-2">Why don't you create it?</p>
                          </div>
                        )
                    }
                  </div>
                </div>
              )
          }
        </div>
      </div>
    </Fragment>
  )
}

export default Distribute