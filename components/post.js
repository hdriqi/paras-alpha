import Link from 'next/link'
import { Carousel } from 'react-responsive-carousel'
import ParseBody from './parseBody'
import { useDispatch } from 'react-redux'
import { withRedux } from '../lib/redux'
import { toggleModalPost } from '../actions/ui'
import TimeAgo from 'javascript-time-ago'
 
import en from 'javascript-time-ago/locale/en'

TimeAgo.addLocale(en)

const timeAgo = new TimeAgo('en-US')

const Post = ({ post }) => {
  const dispatch = useDispatch()

  if(!post.id) {
    return (
      <div>
        Loading
      </div>
    )
  }
  else {
    return (
      <div className="bg-white">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img className="object-cover w-full h-full" src={post.user.avatarUrl} />
            </div>
            <div className="px-4">
              <Link href="/[username]" as={ `/${post.user.username}` }>
                <p className="font-semibold text-black-1">{ post.user.username }</p>
              </Link>
              <p className="text-sm text-black-4">{ timeAgo.format(new Date(post.createdAt)) }</p>
            </div>
          </div>
          <div>
            <svg onClick={_ => dispatch(toggleModalPost(true, post))} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M5 14C3.89543 14 3 13.1046 3 12C3 10.8954 3.89543 10 5 10C6.10457 10 7 10.8954 7 12C7 13.1046 6.10457 14 5 14ZM12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14ZM17 12C17 13.1046 17.8954 14 19 14C20.1046 14 21 13.1046 21 12C21 10.8954 20.1046 10 19 10C17.8954 10 17 10.8954 17 12Z" fill="black"/>
            </svg>
          </div>
        </div>
        <Link href="/post/[id]" as={`/post/${post.id}`}>
          <div>
            {
              post.imgList.length > 0 && post.imgList.length === 1 ? (
                <div className="w-full relative pb-3/4 bg-white">
                  <img className="absolute m-auto w-full h-full object-contain" style={{
                    display: 'block'
                  }} src={post.imgList[0].url} />
                </div>
              ) : (
                <Carousel showArrows={false} showThumbs={false} showStatus={false} emulateTouch={true}>
                {
                  post.imgList.map((img, idx) => {
                    return (
                      <div className="w-full relative pb-3/4 bg-white" key={idx}>
                        <img className="absolute m-auto w-full h-full object-contain" style={{
                          display: 'block'
                        }} src={img.url} />
                      </div>
                    )
                  })
                }
                </Carousel>
              )
            }
            {
              post.bodyRaw && post.imgList.length > 0 && post.bodyRaw.length > 0 && (
                <div className="mb-4"></div>
              )
            }
            <div className="px-4 pb-4">
              <p className="text-black-3 whitespace-pre-line">
                <ParseBody body={post.bodyRaw || ''} />
              </p>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default withRedux(Post)