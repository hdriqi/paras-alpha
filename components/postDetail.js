import Post from "./post"
import Comment from "./comment"
import { useState } from "react"
import { useRouter } from "next/router"
import axios from 'axios'
import TextareaAutosize from 'react-textarea-autosize'

const PostDetail = ({ post , commentList }) => {
  const [comment, setComment] = useState('')
  // const [newComment, setNewComment] = useState([])
  const router = useRouter()

  const _close = () => {
    // console.log(document.referrer)
    router.back()
  }

  const _getUsers = async (query) => {
    if(query.length > 0) {
      const response = await axios.get(`http://localhost:3004/users?username_like=${query}`)
      console.log(response.data)
      setCommentSuggestions(response.data)
    }
  }

  const [onQuery, setOnQuery] = useState(false)
  const [commentSuggestions, setCommentSuggestions] = useState([])

  const _pickSuggestion = (data) => {
    const username = data.username
    const newComment = comment
  }

  const _textareaChange = (e) => {
    const val = e.target.value
    const start = e.target.selectionStart
    const split = val.split(' ')
    const lastWord = split[split.length - 1]

    if(lastWord === '') {
      setOnQuery(false)
    }
    if(lastWord[0] === '@') {
      setOnQuery(true)
    }
    if(onQuery) {
      console.log('show suggestions')
      const query = lastWord.substr(1)
      _getUsers(query)
    }
    setComment(val)
  }

  const _submitComment = async (e) => {
    e.preventDefault()

    const id = Math.random().toString(36).substr(2, 9)

    const response = await axios.post('http://localhost:3004/comments', {
      id: id,
      postId: router.query.id,
      body: comment,
      userId: 'wokoee9',
      createdAt: new Date().toISOString()
    })

    setComment('')
  }

  return (
    <div className="py-12">
      <div className="fixed bg-white top-0 left-0 right-0 h-12 px-4 z-20">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute left-0">
            <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
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
      
      <div className="fixed bottom-0 left-0 right-0">
        {
          onQuery && (
            <div>
              {
                commentSuggestions.map(suggestion => {
                  return (
                    <div onClick={e => _pickSuggestion(suggestion)} key={suggestion.id} className="px-4 py-1">{suggestion.username}</div>
                  )
                })
              }
            </div>
          )
        }
        <div className="flex items-center justify-center shadow-subtle bg-white">
          <div className="flex-auto flex pl-4 py-2">
            <TextareaAutosize maxRows={2} placeholder="Write comment" onChange={e => _textareaChange(e)} value={comment} className="outline-none w-full" />
          </div>
          <div className="w-12">
            <svg onClick={e => _submitComment(e)} className=" m-auto" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 6.89285L7.72163 12.6841L8.40377 12.2748L7.99448 12.9569L13.7857 20.6786L20.6786 0L0 6.89285ZM7.84579 10.2772L4.25371 7.58313L17.5163 3.16228L13.0954 16.4248L10.4014 12.8328L14.2347 6.44384L7.84579 10.2772Z" fill="#222222"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetail