import PostCard from './PostCard'
import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector, batch } from 'react-redux'
import { setProfile } from '../actions/me'
import { withRedux } from '../lib/redux'
import Pop from './Pop'
import Push from './Push'
import PopForward from './PopForward'
import PushForward from './PushForward'

import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import ParseBody from './parseBody'
import near from '../lib/near'
import InfiniteScroll from 'react-infinite-scroll-component'
import { setLoading } from '../actions/ui'
import InfiniteLoader from './InfiniteLoader'
import NavTop from './NavTop'

const ModalMemento = ({ me, memento, close }) => {
  const backBtnRef = useRef(null)
  const pushBtnManageRef = useRef(null)
  const [view, setView] = useState('default')
  const dispatch = useDispatch()

  const _closeModal = (e) => {
    if (e.target.id === 'modal-bg') {
      setView('default')
      close()
    }
  }

  const _delete = async (id) => {
    dispatch(setLoading(true, 'Forgetting memento...'))
    await near.contract.deleteMementoById({
      id: id
    })
    dispatch(setLoading(false))
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
        <PushForward ref={pushBtnManageRef} href="/m/[id]/manage" as={`/m/${memento.id}/manage`} props={{ id: memento.id }}></PushForward>
        <PopForward ref={backBtnRef}></PopForward>
      </div>
      <div className="max-w-sm m-auto bg-dark-0 shadow-lg rounded-lg">
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
                me && me.username == memento.owner && (
                  <button className="w-full p-4  font-medium text-left" onClick={_ => setView('confirmDelete')}>Forget</button>
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
                <button className="p-4 text-red-600 font-medium text-left" onClick={_ => _delete(memento.id)}>Forget</button>
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
          <input readOnly type="text" value={`${window.location.origin}/m/${memento.id}`} id={`urlLink_${memento.id}`} />
        </div>
      </div>
    </div>
  )
}

const Memento = ({ memento, postList, getPost, hasMore, pendingPostCount, notFound }) => {
  const dispatch = useDispatch()

  const me = useSelector(state => state.me.profile)
  const meMementoList = useSelector(state => state.me.blockList)

  const [isFollowing, setIsFollowing] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (Array.isArray(me.following) && me.following.filter(following => following.id === memento.id).length > 0) {
      setIsFollowing(true)
    }
  }, [me, memento])

  useEffect(() => {
    if (showModal) {
      disableBodyScroll(document.querySelector('#modal-bg'), {
        reserveScrollBarGap: true,
      })
    }
    else {
      enableBodyScroll(document.querySelector('#modal-bg'))
    }
  }, [showModal])

  const _toggleFollow = async (me, memento) => {
    const msg = isFollowing ? 'Unfollowing memento...' : 'Following memento...'
    dispatch(setLoading(true, msg))
    const newMe = await near.contract.toggleUserFollow({
      id: me.id,
      targetId: memento.id,
      targetType: 'memento'
    })

    setIsFollowing(!isFollowing)
    batch(() => {
      dispatch(setProfile(newMe))
      dispatch(setLoading(false))
    })
  }

  const list = [
    {
      id: '123',
      owner: 'hikigaya.testnet',
      createdAt: 1591062544522,
      content: [
        {
          type: 'url',
          body: {
            url: 'https://paras.id',
            title: 'Hello World',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            img: 'https://images.pexels.com/photos/4348226/pexels-photo-4348226.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
          }
        }
      ]
    },
    {
      id: '234',
      owner: 'johndoe.testnet',
      createdAt: 1591023010572,
      content: [
        {
          type: 'img',
          body: 'https://siasky.net/fAFPTzAK85tAlobv6YyCXJ4LVvW1rtiwZSF2PJpyU3lbkQ'
        },
        {
          type: 'text',
          body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        },
        {
          type: 'url',
          body: {
            url: 'https://paras.id',
            title: 'Hello World',
            desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            img: 'https://images.pexels.com/photos/4348226/pexels-photo-4348226.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500'
          }
        }
      ]
    }
  ]

  return (
    <div className="bg-dark-0 max-w-sm min-h-screen">
      <NavTop
        left={
          <Pop>
            <svg className="fill-current text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" />
            </svg>
          </Pop>
        }
        center={
          <h3 className="text-xl font-bold text-white">Memento</h3>
        }
        right={
          <svg onClick={_ => setShowModal(true)} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12Z" fill="black" />
          </svg>
        }
      />
      {
        list.map(post => {
          return (
            <div className="mx-4 mt-4">
              <PostCard post={post} />
            </div>
          )
        })
      }
    </div>
  )
}

export default withRedux(Memento)