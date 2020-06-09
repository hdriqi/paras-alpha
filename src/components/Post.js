import PostCard from './PostCard'
import Comment from './Comment'
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { MentionsInput, Mention } from 'react-mentions'
import { useSelector, useDispatch } from 'react-redux'
import Pop from './Pop'
import Push from './Push'
import near from '../lib/near'
import Image from './Image'
import { setLoading } from '../actions/ui'

const PostDetail = ({ post , commentList, mementoList, notFound }) => {
  const profile = useSelector(state => state.me.profile)
  const searchMementoRef = useRef(null)
  const [comment, setComment] = useState('')
  const [inputMemento, setInputMemento] = useState('')
  const [inputMementoData, setInputMementoData] = useState({})
  const [view, setView] = useState('comment')
  const [newCommentList, setNewCommentList] = useState([])
  const [newMementoList, setNewMementoList] = useState([])
  const [searchMemento, setSearchMemento] = useState([])
  const commentRef = useRef(null)
  const router = useRouter()
  const dispatch = useDispatch()

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
      display: `@${user.id}`, 
      id: user.id,
      imgAvatar: user.imgAvatar,
      username: user.id
    }))
    callback(list)
    const suggestionsEl = document.querySelector('.outline-none__suggestions')
    if(suggestionsEl) {
      suggestionsEl.scrollTo(0, suggestionsEl.scrollHeight)
    }
  }

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

  const _submitComment = async (e) => {
    e.preventDefault()

    dispatch(setLoading('true', 'Sending your comment...'))
    const params = {
      postId: router.query.id,
      body: commentRef.current.value,
      bodyRaw: comment,
    }
    const newData = await near.contract.createComment(params)

    newData.user = profile

    const localComment = [...newCommentList]
    localComment.push(newData)
    dispatch(setLoading(false))
    setNewCommentList(localComment)

    setComment('')
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
            <h3 className='text-xl font-bold text-black-1 tracking-tighter'>Post</h3>
          </div>
          <div className='absolute right-0'>
          </div>
        </div>
      </div>
      {
        !notFound ? (
          <PostCard post={post} />
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

export default PostDetail