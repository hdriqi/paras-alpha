import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Pop from './Pop'
import Push from './Push'
import near from '../lib/near'
import { setLoading } from '../actions/ui'

const PostMemento = ({ post, mementoList, notFound }) => {
  const profile = useSelector(state => state.me.profile)
  const searchMementoRef = useRef(null)
  const [inputMemento, setInputMemento] = useState('')
  const [inputMementoData, setInputMementoData] = useState({})
  const [newMementoList, setNewMementoList] = useState([])
  const [searchMemento, setSearchMemento] = useState([])
  const dispatch = useDispatch()

  const _getSearchMemento = async (query) => {
    setInputMemento(query)
    setInputMementoData({})
    if (!query) {
      setSearchMemento([])
      return
    }
    const q = [`name_like:=${query}`]
    const mementoList = await near.contract.getMementoList({
      query: q,
      opts: {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _limit: 10
      }
    })
    setSearchMemento(mementoList)
    searchMementoRef.current.scrollTo(0, searchMementoRef.current.scrollHeight)
  }

  const _selectMemento = (memento) => {
    setInputMemento(memento.name)
    setInputMementoData(memento)
    setSearchMemento([])
  }

  const _transmitInputMemento = async () => {
    dispatch(setLoading(true, 'Transmitting memory...'))
    const newData = await near.contract.transmitPost({
      originalId: post.originalId,
      mementoId: inputMementoData.id
    })

    setInputMemento('')
    setInputMementoData({})
    setSearchMemento([])

    dispatch(setLoading(false))
    if(newData.status === 'published') {
      const nextMementoList = [...newMementoList].concat([inputMementoData])
      setNewMementoList(nextMementoList)
    }
  }

  return (
    <div className={`bg-dark-0 min-h-screen`}>
      <div className='sticky bg-dark-0 top-0 h-12 px-4 z-20'>
        <div className='relative w-full h-full flex items-center justify-center'>
          <div className='absolute left-0'>
            <Pop>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path fillRule='evenodd' clipRule='evenodd' d='M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z' fill='#222'/>
              </svg>
            </Pop>
          </div>
          <div>
            <h3 className='text-xl font-bold text-black-1 tracking-tighter'>Memento</h3>
          </div>
          <div className='absolute right-0'>
          </div>
        </div>
      </div>
      {
        !notFound ? (
          <div>
            <div>
              <div style={{
                minHeight: `8rem`
              }}>
                {
                  mementoList.map((memento, idx) => {
                    return (
                      <Push key={memento.id} href='/m/[id]' as={ `/m/${memento.id}`} props={{
                        id: memento.id
                      }} query={{id: post.blockId}}>
                        <div className='flex items-center justify-between px-4 py-2 mt-4 bg-dark-0 shadow-subtle'>
                          <div className='w-8/12 flex items-center overflow-hidden'>
                            <div>
                              <div className='flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1'>
                                <div className='w-4 h-4 m-auto bg-dark-0'></div>
                              </div>
                            </div>
                            <div className='px-4 w-auto'>
                              <p className='font-semibold text-black-1 truncate whitespace-no-wrap min-w-0'>{ memento.name }</p>
                              <p className='text-black-3 text-sm truncate whitespace-no-wrap min-w-0'>by { memento.user.username }</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-black-3 text-sm truncate whitespace-no-wrap min-w-0'>{ memento.type }</p>
                          </div>
                        </div>
                      </Push>
                    )
                  })
                }
                {
                  newMementoList.map((memento, idx) => {
                    return (
                      <Push key={idx} href='/m/[id]' as={`/m/${memento.id}`} props={{
                        memento: memento
                      }}>
                        <div className='flex items-center justify-between px-4 py-2 mt-4 bg-dark-0 shadow-subtle'>
                          <div className='w-8/12 flex items-center overflow-hidden'>
                            <div>
                              <div className='flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1'>
                                <div className='w-4 h-4 m-auto bg-dark-0'></div>
                              </div>
                            </div>
                            <div className='px-4 w-auto'>
                              <p className='font-semibold text-black-1 truncate whitespace-no-wrap min-w-0'>{ memento.name }</p>
                              <p className='text-black-3 text-sm truncate whitespace-no-wrap min-w-0'>by { memento.user.username }</p>
                            </div>
                          </div>
                          <div className='text-right'>
                            <p className='text-black-3 text-sm truncate whitespace-no-wrap min-w-0'>{ memento.type }</p>
                          </div>
                        </div>
                      </Push>
                    )
                  })
                }
              </div>
              <div className={`${profile && profile.id ? 'visible' : 'invisible'} fixed bottom-0 left-0 right-0`}>
                <div ref={searchMementoRef} className='shadow-subtle overflow-auto' style={{
                  maxHeight: `32rem`
                }}>
                  {
                    searchMemento.map(memento => {
                      return (
                        <div key={memento.id} onClick={_ => _selectMemento(memento)} className='flex items-center justify-between px-4 py-2 bg-dark-0 border-t h-16'>
                          <div className='w-8/12 flex items-center overflow-hidden'>
                            <div>
                              <div className='flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1'>
                                <div className='w-4 h-4 m-auto bg-dark-0'></div>
                              </div>
                            </div>
                            <div className='px-4 w-auto'>
                              <p className='font-semibold text-black-1 truncate whitespace-no-wrap min-w-0'>{ memento.name }</p>
                              <p className='text-black-3 text-sm truncate whitespace-no-wrap min-w-0'>by { memento.user.username }</p>
                            </div>
                          </div>
                          <div className='text-right'>
                          <p className='text-black-3 text-sm truncate whitespace-no-wrap min-w-0'>{ memento.type }</p>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
                <div className='flex items-center justify-center shadow-subtle bg-dark-0'>
                  <div className='w-full pl-4 py-2'>
                    <input type='text' value={inputMemento} onChange={e => _getSearchMemento(e.target.value)} className='w-full outline-none' placeholder='Search memento' />
                  </div>
                  <div className='w-12'>
                    <button className='block m-auto h-full' disabled={!inputMementoData.id} onClick={e => _transmitInputMemento(e)} >
                      <svg className='mr-2 fill-current' width='21' height='21' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path d='M15 9H9V15H15V9ZM13.5 13.5H10.5V10.5H13.5V13.5Z' /><path d='M22.5 10.5V9H19.125V4.875H15V1.5H13.5V4.875H10.5V1.5H9V4.875H4.875V9H1.5V10.5H4.875V13.5H1.5V15H4.875V19.125H9V22.5H10.5V19.125H13.5V22.5H15V19.125H19.125V15H22.5V13.5H19.125V10.5H22.5ZM17.625 17.625H6.375V6.375H17.625V17.625Z' />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 pt-8">
            <p className="font-bold uppercase text-3xl">Not Found</p>
            <p className="mt-4 text-black-3">This post does not exist. It might be deleted by the owner.</p>
          </div>
        )
      }
    </div>
  )
}

export default PostMemento