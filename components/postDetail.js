import Post from "./post"
import Comment from "./comment"
import { useState, useRef } from "react"
import { useRouter } from "next/router"
import axios from 'axios'
import { MentionsInput, Mention } from 'react-mentions'
import { useSelector } from "react-redux"

const PostDetail = ({ post , commentList }) => {
  const profile = useSelector(state => state.me.profile)
  const [comment, setComment] = useState('')
  const [newCommentList, setNewCommentList] = useState([])
  const commentRef = useRef(null)
  const router = useRouter()

  const _close = () => {
    router.back()
  }

  const _getUsers = async (query, callback) => {
    if (!query) return
    const response = await axios.get(`http://localhost:3004/users?username_like=${query}`)
    const list = response.data.map(user => ({ display: `@${user.username}`, id: user.id }))
    callback(list)
  }

  const _submitComment = async (e) => {
    e.preventDefault()

    const id = Math.random().toString(36).substr(2, 9)

    await axios.post('http://localhost:3004/comments', {
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
    <div className="py-12">
      <div className="fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute left-0">
            <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
            </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Post</h3>
          </div>
          <div className="absolute right-0">
          </div>
        </div>
      </div>
      <div>
        <Post post={post} />
      </div>
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
      <div className="fixed bottom-0 left-0 right-0">
        <div className="flex items-center justify-center shadow-subtle bg-white">
          <div className="w-full pl-4 py-2">
            <MentionsInput className="outline-none w-full max-w-full break-all" style={{
              maxHeight: `3rem`
            }} 
              style={{
                control: {
                  fontSize: `16px`,
                  fontWeight: `500`
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
              placeholder="Write comment" 
              onChange={e => setComment(e.target.value)} 
              value={comment}
              allowSuggestionsAboveCursor={true}
              inputRef={commentRef}
            >
              <Mention
                trigger="@"
                data={_getUsers}
                appendSpaceOnAdd={true}
              />
            </MentionsInput>
          </div>
          <div className="w-12">
            <svg onClick={e => _submitComment(e)} className="text-b m-auto" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 6.89285L7.72163 12.6841L8.40377 12.2748L7.99448 12.9569L13.7857 20.6786L20.6786 0L0 6.89285ZM7.84579 10.2772L4.25371 7.58313L17.5163 3.16228L13.0954 16.4248L10.4014 12.8328L14.2347 6.44384L7.84579 10.2772Z" fill="#222222"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail