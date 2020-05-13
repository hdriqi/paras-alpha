import PostCard from './PostCard'
import Comment from './Comment'
import { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { MentionsInput, Mention } from 'react-mentions'
import { useSelector } from 'react-redux'
import Pop from './Pop'
import Push from './Push'

const PostDetail = ({ post , commentList, mementoList }) => {
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

  const _getUsers = async (query, callback) => {
    if (!query) return
    const response = await axios.get(`https://internal-db.dev.paras.id/users?username_like=${query}`)
    const list = response.data.map(user => ({ 
      display: `@${user.username}`, 
      id: user.id,
      avatarUrl: user.avatarUrl,
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
    const response = await axios.get(`https://internal-db.dev.paras.id/blocks?name_like=${query}`)
    const newList = await Promise.all(response.data.map(memento => {
      return new Promise(async (resolve) => {
        const resUser = await axios.get(`https://internal-db.dev.paras.id/users/${memento.userId}`)
        memento.user = resUser.data
        resolve(memento)
      })
    }))
    setSearchMemento(newList)
    searchMementoRef.current.scrollTo(0, searchMementoRef.current.scrollHeight)
  }

  const _selectMemento = (memento) => {
    setInputMemento(memento.name)
    setInputMementoData(memento)
    setSearchMemento([])
  }

  const _transmitInputMemento = async () => {
    const id = Math.random().toString(36).substr(2, 9)
    const newData = {
      id: id,
      originalId: post.originalId,
      status: inputMementoData.type === 'public' ? 'published' : 'pending',
      body: post.body,
      bodyRaw: post.bodyRaw,
      imgList: post.imgList,
      userId: profile.id,
      blockId: inputMementoData.id,
      createdAt: new Date().toISOString()
    }

    await axios.post('https://internal-db.dev.paras.id/posts', newData)
    setInputMemento('')
    setInputMementoData({})
    setSearchMemento([])

    if(newData.status === 'published') {
      const nextMementoList = [...newMementoList].concat([inputMementoData])
      setNewMementoList(nextMementoList)
    }
  }

  const _submitComment = async (e) => {
    e.preventDefault()

    const id = Math.random().toString(36).substr(2, 9)

    await axios.post('https://internal-db.dev.paras.id/comments', {
      id: id,
      postId: router.query.id,
      body: commentRef.current.value,
      bodyRaw: comment,
      userId: profile.id,
      createdAt: new Date().toISOString()
    })

    const localComment = [...newCommentList]
    localComment.push({
      id: id,
      postId: router.query.id,
      body: commentRef.current.value,
      bodyRaw: comment,
      userId: profile.id,
      createdAt: new Date().toISOString(),
      user: profile
    })
    setNewCommentList(localComment)

    setComment('')
  }

  return (
    <div className={`py-12 bg-white-1 min-h-screen`}>
      <div className='fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20'>
        <div className='relative w-full h-full flex items-center justify-center'>
          <div className='absolute left-0'>
            <Pop>
              <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path fillRule='evenodd' clipRule='evenodd' d='M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z' fill='#222'/>
              </svg>
            </Pop>
          </div>
          <div>
            <h3 className='text-2xl font-bold text-black-1 tracking-tighter'>Post {post.status === 'pending' && 'Pending'}</h3>
          </div>
          <div className='absolute right-0'>
          </div>
        </div>
      </div>
      <div className={`${post.status === 'pending' && 'opacity-25'}`}>
        <div>
          {
            post.id ? (
              <div>
                <PostCard post={post} />
                <div className='flex bg-white'>
                  <div className={`${view !== 'memento' && `opacity-25`} w-1/2  border-b border-black-1`}>
                    <button onClick={_ => setView('memento')} className='w-full font-semibold p-4 focus:outline-none'>Memento</button>
                  </div>
                  <div className={`${view !== 'comment' && `opacity-25`} w-1/2  border-b border-black-1`}>
                    <button onClick={_ => setView('comment')} className='w-full font-semibold p-4 focus:outline-none'>Comment</button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                Loading
              </div>    
            )
          }
        </div>
        {
          view === 'memento' && (
            <div>
              <div>
                {
                  mementoList.map((memento, idx) => {
                    return (
                      <Push key={memento.id} href='/m/[id]' as={ `/m/${memento.id}`} props={{
                        memento: memento
                      }} query={{id: post.blockId}}>
                        <div className='flex items-center justify-between px-4 py-2 mt-4 bg-white shadow-subtle'>
                          <div className='w-8/12 flex items-center overflow-hidden'>
                            <div>
                              <div className='flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1'>
                                <div className='w-4 h-4 m-auto bg-white'></div>
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
              <div>
                {
                  newMementoList.map((memento, idx) => {
                    return (
                      <Push key={idx} href='/m/[id]' as={`/m/${memento.id}`} props={{
                        memento: memento
                      }}>
                        <div className='flex items-center justify-between px-4 py-2 mt-4 bg-white shadow-subtle'>
                          <div className='w-8/12 flex items-center overflow-hidden'>
                            <div>
                              <div className='flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1'>
                                <div className='w-4 h-4 m-auto bg-white'></div>
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
              <div className='fixed bottom-0 left-0 right-0'>
                <div ref={searchMementoRef} className='shadow-subtle overflow-auto' style={{
                  maxHeight: `32rem`
                }}>
                  {
                    searchMemento.map(memento => {
                      return (
                        <div key={memento.id} onClick={_ => _selectMemento(memento)} className='flex items-center justify-between px-4 py-2 bg-white border-t h-16'>
                          <div className='w-8/12 flex items-center overflow-hidden'>
                            <div>
                              <div className='flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1'>
                                <div className='w-4 h-4 m-auto bg-white'></div>
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
                <div className='flex items-center justify-center shadow-subtle bg-white'>
                  <div className='w-full pl-4 py-2'>
                    <input type='text' value={inputMemento} onChange={e => _getSearchMemento(e.target.value)} className='w-full outline-none' placeholder='Search memento' />
                  </div>
                  <div className='w-12'>
                    <button className='block m-auto h-full' disabled={!inputMementoData.id} onClick={e => _transmitInputMemento(e)} >
                    <svg className='mr-2 fill-current' width='21' height='21' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
  <path d='M15 9H9V15H15V9ZM13.5 13.5H10.5V10.5H13.5V13.5Z' />
  <path d='M22.5 10.5V9H19.125V4.875H15V1.5H13.5V4.875H10.5V1.5H9V4.875H4.875V9H1.5V10.5H4.875V13.5H1.5V15H4.875V19.125H9V22.5H10.5V19.125H13.5V22.5H15V19.125H19.125V15H22.5V13.5H19.125V10.5H22.5ZM17.625 17.625H6.375V6.375H17.625V17.625Z' />
  </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        {
          view === 'comment' && (
            <div>
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
              <div className='fixed bottom-0 left-0 right-0'>
                <div className='flex items-center justify-center shadow-subtle bg-white'>
                  <div className='w-full pl-4 py-2'>
                    <MentionsInput className='outline-none w-full max-w-full break-all' 
                      style={{
                        control: {
                          fontSize: `16px`,
                          fontWeight: `500`,
                          color: '#616161'
                        },
                        suggestions: {
                          // top: 'auto',
                          left: `-1rem`,
                          // bottom: `2.1rem`,
                          maxHeight: `32rem`,
                          overflow: 'scroll',
                          width: `100vw`,

                          // list: {
                          //   position: `relative`,
                          //   left: `6rem`
                          // },

                          item: {
                            '&focused': {
                              backgroundColor: '#DFDFDF',
                            },
                          },
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
                        renderSuggestion={(entry, search) => {
                          return (
                            <div className='flex items-center justify-between px-4 py-2 bg-white border-t h-16'>
                              <div className="w-8/12 flex items-center overflow-hidden">
                                <div>
                                  <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <img style={{
                                      boxShadow: `0 0 4px 0px rgba(0, 0, 0, 0.75) inset`
                                    }} className="object-cover w-full h-full" src={entry.avatarUrl} />
                                  </div>
                                </div>
                                <div className="px-4 w-auto">
                                  <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{ entry.username }</p>
                                  {/* <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{ user.bio }</p> */}
                                </div>
                              </div>
                            </div>
                          )
                        }}
                      />
                    </MentionsInput>
                  </div>
                  <div className='w-12'>
                    <svg onClick={e => _submitComment(e)} className='text-b m-auto' width='21' height='21' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path fillRule='evenodd' clipRule='evenodd' d='M0 6.89285L7.72163 12.6841L8.40377 12.2748L7.99448 12.9569L13.7857 20.6786L20.6786 0L0 6.89285ZM7.84579 10.2772L4.25371 7.58313L17.5163 3.16228L13.0954 16.4248L10.4014 12.8328L14.2347 6.44384L7.84579 10.2772Z' fill='#222222'/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export default PostDetail