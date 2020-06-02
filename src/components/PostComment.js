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

const PostComment = ({ post , commentList, mementoList, notFound }) => {
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
      display: `@${user.username}`, 
      id: user.id,
      imgAvatar: user.imgAvatar,
      username: user.username
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
            <h3 className='text-xl font-bold text-black-1 tracking-tighter'>Comments</h3>
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
                <div>
                  {
                    commentList.map(comment => {
                      return (
                        <div key={comment.id}>
                          <Comment comment={comment} />
                        </div>
                      )
                    })
                  }
                </div>
                <div>
                  {
                    newCommentList.map(newComment => {
                      return (
                        <div key={newComment.id}>
                          <Comment comment={newComment} />
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className={`${profile && profile.id ? 'visible' : 'invisible'} fixed bottom-0 left-0 right-0`}>
                <div className="flex items-center justify-center shadow-subtle bg-dark-0 relative">
                  <div className='w-full'>
                    <MentionsInput className='outline-none w-full max-w-full' 
                      style={{
                        control: {
                          fontSize: `16px`,
                          fontWeight: `500`,
                          color: '#616161'
                        },
                        input: {
                          margin: 0,
                          padding: `.5rem`,
                          paddingLeft: `1rem`,
                          paddingRight: `3rem`,
                          overflow: `auto`,
                        },
                        suggestions: {
                          maxHeight: `32rem`,
                          overflowY: 'auto',
                          width: `100vw`,
                          maxWidth: `100%`,
                          boxShadow: `0px 0px 4px rgba(0, 0, 0, 0.15)`
                        },
                      }}
                      placeholder='Write comment' 
                      onChange={e => setComment(e.target.value)} 
                      value={comment}
                      allowSuggestionsAboveCursor={true}
                      inputRef={commentRef}
                    >
                      <Mention
                        trigger='@'
                        data={_getUsers}
                        appendSpaceOnAdd={true}
                        style={{
                          color: '#1B1B1B'
                        }}
                        renderSuggestion={(entry) => {
                          return (
                            <div className='flex items-center justify-between px-4 py-2 bg-dark-0 h-16'>
                              <div className="w-8/12 flex items-center overflow-hidden">
                                <div>
                                  <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <Image style={{
                                      boxShadow: `0 0 4px 0px rgba(0, 0, 0, 0.75) inset`
                                    }} className="object-cover w-full h-full" data={entry.imgAvatar} />
                                  </div>
                                </div>
                                <div className="px-4 w-auto">
                                  <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{ entry.username }</p>
                                </div>
                              </div>
                            </div>
                          )
                        }}
                      />
                    </MentionsInput>
                  </div>
                  <div className="w-12 absolute right-0">
                    <svg onClick={e => _submitComment(e)} className='text-b m-auto' width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path fillRule='evenodd' clipRule='evenodd' d='M0 6.89285L7.72163 12.6841L8.40377 12.2748L7.99448 12.9569L13.7857 20.6786L20.6786 0L0 6.89285ZM7.84579 10.2772L4.25371 7.58313L17.5163 3.16228L13.0954 16.4248L10.4014 12.8328L14.2347 6.44384L7.84579 10.2772Z' fill='#222222'/>
                    </svg>
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

export default PostComment