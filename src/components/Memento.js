import PostCard from './PostCard'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setProfile } from '../actions/me'
import { withRedux } from '../lib/redux'
import Pop from './Pop'
import Push from './Push'
import PopForward from './PopForward'
import PushForward from './PushForward'

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import ParseBody from './parseBody'
import near from '../lib/near'

const ModalMemento = ({ me, memento, close }) => {
  const backBtnRef = useRef(null)
  const pushBtnManageRef = useRef(null)
  const [view, setView] = useState('default')

  const _closeModal = (e) => {
    if(e.target.id === 'modal-bg') {
      setView('default')
      close()
    }
  }

  const _delete = async (id) => {
    await near.contract.deleteMementoById({
      id: id
    })
    close()
    backBtnRef.current.click()
  }

  const _copyLink = () => {
    var copyText = document.getElementById(`urlLink_${memento.id}`)
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy")
    setView('confirmCopyLink')
    setTimeout(() => {
      setView('default')
      close()
    }, 1000)
  }

  const _manage = () => {
    setView('default')
    close()
    pushBtnManageRef.current.click()
  }

  return (
    <div id="modal-bg" onClick={(e) => _closeModal(e)} className="fixed inset-0 w-full h-full z-40 p-8 pt-40" style={{
      backgroundColor: `rgba(0,0,0,0.5)`
    }}>
      <div className="invisible">
        <PushForward ref={pushBtnManageRef} href="/m/[id]/manage" as={`/m/${memento.id}/manage`} props={{id: memento.id}}></PushForward>
        <PopForward ref={backBtnRef}></PopForward>
      </div>
      <div className="max-w-sm m-auto bg-white shadow-lg rounded-lg">
        {
          view === 'default' && (
          <div>
            {/* {
              meMementoList.findIndex(memento => memento.id === memento.id) > -1 && (
                <button className="w-full p-4 font-medium text-left" onClick={_ => _manage()}>Manage</button>
              )
            } */}
            <button className="w-full p-4 font-medium text-left" onClick={_ => _copyLink()}>Copy Link</button>
            {
              me && memento.user && me.username == memento.user.username && (
                <button className="w-full p-4  font-medium text-left"  onClick={_ => setView('confirmDelete')}>Forget</button>
              )
            }
          </div>
          )
        }
        {
          view === 'confirmDelete' && (
            <div>
              <p className="p-4">Are you sure you want to forget this memento?</p>
              <div className="flex justify-end">
                <button className="p-4 font-medium text-left" onClick={_ => setView('default')}>Cancel</button>
                <button className="p-4 text-red-600 font-medium text-left"  onClick={_ => _delete(memento.id)}>Forget</button>
              </div>
            </div>
          )
        }
        {
          view === 'confirmCopyLink' && (
            <div>
              <p className="p-4">Link copied!</p>
            </div>
          )
        }
        <div className="opacity-0 absolute">
          <input readOnly type="text" value={`http://localhost:3000/m/${memento.id}`} id={`urlLink_${memento.id}`} />
        </div>
      </div>
    </div>
  )
}

const Memento = ({ memento, postList, pendingPostCount }) => {
  const dispatch = useDispatch()

  const me = useSelector(state => state.me.profile)
  const meMementoList = useSelector(state => state.me.blockList)

  const [isFollowing, setIsFollowing] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if(Array.isArray(me.following) && me.following.filter(following => following.id === memento.id).length > 0) {
      setIsFollowing(true)
    }
  }, [me, memento])

  useEffect(() => {
    if(showModal) {
      disableBodyScroll(document.querySelector('#modal-bg'))
    }
    else {
      enableBodyScroll(document.querySelector('#modal-bg'))
    }
  }, [showModal])

  const _toggleFollow = async (me, memento) => {
    const newMe = await near.contract.toggleUserFollow({
      id: me.id,
      targetId: memento.id, 
      targetType: 'memento'
    })

    setIsFollowing(!isFollowing)
    dispatch(setProfile(newMe))
  }

  return (
    <div className='py-12 bg-white-1 min-h-screen'>
      <div className={`${showModal ? 'visible' : 'invisible'}`}>
        <ModalMemento me={me} memento={memento} meMementoList={meMementoList} close={() => setShowModal(false)} />
      </div>
      <div className='fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20 '>
        <div className='relative w-full h-full flex items-center justify-center'>
          <div className='absolute left-0'>
            <Pop>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path fillRule='evenodd' clipRule='evenodd' d='M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z' fill='#222'/>
              </svg>
            </Pop>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-black-1 tracking-tighter'>Memento</h3>
          </div>
          <div className='absolute right-0'>
            <svg onClick={_ => setShowModal(true)} width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path fillRule='evenodd' clipRule='evenodd' d='M5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12Z' fill='black'/>
            </svg>
          </div>
        </div>
      </div>
      <div className='pb-12'>
        <div className='bg-white py-6 px-4 text-center shadow-subtle'>
          <h4 className='text-2xl font-bold'>{memento.name}</h4>
            {
              memento.user && (
                <p>by&nbsp;
                  <Push href="/[username]" as={ `/${memento.user.username}` } props={{
                    username: memento.user.username,
                    user: memento.user
                  }}>
                    <span className='font-semibold text-black-1'>{ memento.user.username }</span>
                  </Push>
                </p>
              )
            }
            <p className='mt-2 text-black-3 whitespace-pre-line '><ParseBody body={memento.descRaw}/></p>
            <div className='px-4 mt-4'>
              {
                memento.user && me.username == memento.owner ? (
                  <Push href="/m/[id]/edit" as={`/m/${memento.id}/edit`} props={{
                    id: memento.id,
                    memento: memento
                  }}>
                    <button className='outline-none focus:outline-none relative font-semibold border border-black-1 border-solid px-2 py-1 text-sm rounded-md' style={{
                      minWidth: `6rem`
                    }}>
                      Edit Memento
                      {
                        pendingPostCount && (
                          <div className="text-xs absolute flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-black-1 text-white" style={{
                            bottom: `50%`,
                            right: `-.75rem`
                          }}>
                            {pendingPostCount}
                          </div>
                        )
                      }
                    </button>
                  </Push>
                ) : (
                  isFollowing ? (
                    <button onClick={e => _toggleFollow(me, memento)} className='font-semibold border border-black-1 border-solid px-2 py-1 text-sm rounded-md' style={{
                      minWidth: `6rem`
                    }}>Following</button>
                  ) : (
                    <button onClick={e => _toggleFollow(me, memento)} className='font-semibold bg-black-1 text-white px-2 py-1 text-sm rounded-md' style={{
                      minWidth: `6rem`
                    }}>Follow</button>
                  )
                )
              }
            </div>
        </div>
        <div>
          {
            postList.map(post => {
              return (
                <div className='mt-6 shadow-subtle' key={post.id}>
                  <PostCard post={post} />
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default withRedux(Memento)