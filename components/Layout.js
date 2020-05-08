import { Fragment, useEffect, useState } from "react"
import Head from 'next/head'
import { setProfile, addData, addBlockList } from "../actions/me"
import { withRedux } from '../lib/redux'
import { useDispatch, useSelector, batch } from "react-redux"
import axios from "axios"
import { useRouter } from "next/router"
import { toggleModalPost } from "../actions/ui"
import Link from "next/link"

const ModalPost = ({ profile }) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const showModalPost = useSelector(state => state.ui.showModalPost)
  const myMementoList = useSelector(state => state.me.blockList)
  const postData = useSelector(state => state.ui.showModalPostData)
  const postList = useSelector(state => state.me.data[router.asPath])
  const [view, setView] = useState('default')

  const _closeModal = (e) => {
    if(e.target.id === 'modal-bg') {
      setView('default')
      dispatch(toggleModalPost(false, {}))
    }
  }

  const _delete = async (id) => {
    await axios.delete(`http://localhost:3004/posts/${id}`)
    if(Array.isArray(postList)) {
      const currPostList = [...postList]
      const nextPostList = currPostList.filter(post => post.id !== id)
      dispatch(addData(router.asPath, nextPostList))
    }
    dispatch(toggleModalPost(false, {}))  
  }

  const _copyLink = () => {
    var copyText = document.getElementById("urlLink")
    copyText.select()
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy")
    setView('confirmCopyLink')
    setTimeout(() => {
      setView('default')
      dispatch(toggleModalPost(false, {}))
    }, 1000)
  }

  return (
    showModalPost && (
      <div id="modal-bg" onClick={(e) => _closeModal(e)} className="fixed inset-0 w-full h-full z-40 p-8 pt-40" style={{
        backgroundColor: `rgba(0,0,0,0.5)`
      }}>
        <div className="max-w-sm m-auto bg-white shadow-lg rounded-lg">
          {
            view === 'default' && (
              <div>
              <button className="w-full p-4 font-medium text-left" onClick={_ => _copyLink()}>Copy Link</button>
              {
                (profile && profile.username == postData.user.username || myMementoList.findIndex(memento => memento.id === postData.blockId) > -1) && (
                  <button className="w-full p-4  font-medium text-left"  onClick={_ => setView('confirmDelete')}>Delete</button>
                )
              }
            </div>
            )
          }
          {
            view === 'confirmDelete' && (
              <div>
                <p className="p-4">Do you want to delete this post?</p>
                <div className="flex justify-end">
                  <button className="p-4 font-medium text-left" onClick={_ => setView('default')}>Cancel</button>
                  <button className="p-4 text-red-600 font-medium text-left"  onClick={_ => _delete(postData.id)}>Delete</button>
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
            <input readOnly type="text" value={`http://localhost:3000/post/${postData.id}`} id="urlLink" />
          </div>
        </div>
      </div>
    )
  )
}

const Layout = ({ children }) => {
  const dispatch = useDispatch()
  const profile = useSelector(state => state.me.profile)

  useEffect(() => {
    const getData = async () => {
      const userId = window.localStorage.getItem('meId')
      const resUser = await axios.get(`http://localhost:3004/users/${userId}`)
      const respMementoList = await axios.get(`http://localhost:3004/blocks?userId=${userId}`)
      const mementoList = await Promise.all(respMementoList.data.map(memento => {
        return new Promise(async (resolve) => {
          const resUser = await axios.get(`http://localhost:3004/users/${memento.userId}`)
          memento.user = resUser.data
          resolve(memento)
        })
      }))
      const me = resUser.data
      batch(() => {
        dispatch(setProfile(me))
        dispatch(addBlockList(mementoList))
      })
    }
    if(!profile.id) {
      getData()
    }
  }, [])
  
  return (
    <Fragment>
      <Head>
        <title>Paras</title>
      </Head>
      <div className="max-w-md m-auto mobile">
        { children }
      </div>
      <ModalPost profile={profile} />
    </Fragment>
  )
}

export default withRedux(Layout)