import { useState } from 'react'
import Pop from '../Pop'
import Push from '../Push'
import Image from '../Image'
import NavTop from '../NavTop'
import MementoTransmit from './MementoTransmit'
import { setPostListIds } from 'actions/home'
import { useSelector, useDispatch } from 'react-redux'
import { setUserPostListIds } from 'actions/user'
import { addPostList } from 'actions/entities'

const PostMemento = ({ post, mementoList, notFound }) => {
  const dispatch = useDispatch()  
  const postListIds = useSelector(state => state.home.postListIds)
  const userPostListIds = useSelector(state => state.user[post.owner]?.postListIds)
  const [newMementoList, setNewMementoList] = useState([])
  const [showMementoTransmit, setShowMementoTransmit] = useState(false)

  return (
    <div className={`bg-dark-0 min-h-screen`}>
      {
        showMementoTransmit && (
          <MementoTransmit
            left={_ => setShowMementoTransmit(false)}
            right={newPost => {
              // hide memento transmit modal
              setShowMementoTransmit(false)
              // add new memento to list
              const nextMementoList = [...newMementoList].concat([newPost.memento])
              setNewMementoList(nextMementoList)
              // add new post to home & profile
              dispatch(addPostList([newPost]))
              if (postListIds && Array.isArray(postListIds)) {
                const newPostListIds = [...postListIds]
                newPostListIds.unshift(newPost.id)
                dispatch(setPostListIds(newPostListIds))
              }

              if (userPostListIds && Array.isArray(userPostListIds)) {
                const newUserPostListIds = [...userPostListIds]
                newUserPostListIds.unshift(newPost.id)
                dispatch(setUserPostListIds(post.owner, newUserPostListIds))
              }
            }}
            post={post}
            currentTransmitList={mementoList}
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
          <h3 className="text-lg font-bold text-white px-2">Transmit</h3>
        }
        right={
          <button onClick={_ => setShowMementoTransmit(true)}>
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
            <div className="px-4 py-2">
              {
                mementoList.sort((a,b) => a.id.localeCompare(b.id)).concat(newMementoList).map(m => {
                  return (
                    <Push key={m.id} href='/m/[id]' as={`/m/${m.id}`} props={{
                      id: m.id,
                      fetch: true
                    }}>
                      <div key={m.id} className="flex items-center my-2 bg-dark-2 rounded-md p-2 cursor-pointer hover:bg-dark-24">
                        <div className="flex w-4/5">
                          <div className="w-6 h-6 rounded-sm overflow-hidden">
                            {
                              m.img ? (
                                <Image data={m.img} />
                              ) : (
                                  <div className="bg-white flex items-center justify-center">
                                    <p className="text-primary-5 font-extrabold">{m.id}</p>
                                  </div>
                                )
                            }
                          </div>
                          <h4 className="ml-2 font-bold text-white truncate">{m.id}</h4>
                        </div>
                        <div className="w-1/5 text-right">
                          <h4 className="text-primary-5 uppercase text-xs tracking-wide">{m.type}</h4>
                        </div>
                      </div>
                    </Push>
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