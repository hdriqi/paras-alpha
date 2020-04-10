import { withRedux } from "../lib/redux"
import Post from './post'

const Home = ({ postList }) => {
  return (
    <div className="bg-white-1 pb-32">
      <div className="pb-16">
        <div className="fixed z-10 top-0 left-0 right-0 bg-white shadow-subtle px-4 py-2">
          <div className="w-full h-full relative">
            <div className="flex ">
              <h1 className="text-3xl font-bold">Feed</h1>
              <h1 className="ml-4 text-3xl font-bold text-black-3">Recent</h1>
            </div>
            <div className="absolute top-0 right-0 py-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {
        postList.map(post => {
          return (
            <div className="mt-10 shadow-subtle" key={post.id}>
              <Post post={post} />
            </div>
          )
        })
      }
    </div>
  )
}

export default withRedux(Home)