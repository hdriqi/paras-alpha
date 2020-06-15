import { useState } from 'react'
import Pop from '../Pop'
import Push from '../Push'
import Image from '../Image'
import NavTop from '../NavTop'
import CommentAdd from './CommentAdd'
import Comment from 'components/Comment'

const PostMemento = ({ post, commentList, notFound }) => {
  const [newCommentList, setNewCommentList] = useState([])
  const [showCommentAdd, setShowCommentAdd] = useState(false)
  
  const combinedCommentList = newCommentList.concat(commentList)

  return (
    <div className={`bg-dark-0 min-h-screen`}>
      {
        showCommentAdd && (
          <CommentAdd
            left={_ => setShowCommentAdd(false)}
            right={comment => {
              setShowCommentAdd(false)
              const nextCommentList = [...newCommentList].concat([comment])
              setNewCommentList(nextCommentList)
            }}
            post={post}
          />
        )
      }
      <NavTop
        left={
          <Pop>
            <a>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
              </svg>
            </a>
          </Pop>
        }
        center={
          <h3 className="text-lg font-bold text-white px-2">Comment</h3>
        }
        right={
          <button onClick={_ => setShowCommentAdd(true)}>
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="15" fill="#E13128" stroke="#E13128" strokeWidth="2" />
              <path fillRule="evenodd" clipRule="evenodd" d="M14.5408 22.3337V17.4598H9.66699V14.5408H14.5408V9.66699H17.4598V14.5408H22.3337V17.4598H17.4598V22.3337H14.5408Z" fill="white" />
            </svg>
          </button>
        }
      />
      {
        !notFound ? (
          <div>
            <div className="px-4 pb-4">
              {
                combinedCommentList.length === 0 ? (
                  <div className="text-center mt-2 p-2">
                    <h4 className="text-white text-lg font-semibold">Write a Comment</h4>
                    <p className="text-white-1 pt-2">Click on button at top right to add a comment</p>
                  </div>
                ) : commentList.concat(newCommentList).map(c => {
                  return (
                    <div key={c.id} >
                      <Comment comment={c} />
                    </div>
                  )
                })
              }
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