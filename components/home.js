import { useSelector } from "react-redux"
import { Carousel } from 'react-responsive-carousel'
import { withRedux } from "../lib/redux"

const Post = ({ data }) => {
  return (
    <div className="mt-6 bg-white shadow-subtle">
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img className="object-cover w-full h-full" src={data.author.avatarUrl} />
        </div>
        <div className="px-4">
          <p className="font-semibold text-black-1">{ data.author.username }</p>
          <p>in <span className="font-semibold text-black-1">{ data.block.name }</span></p>
        </div>
      </div>
      <div>
        {
          data.imgList.length > 0 && (
            <Carousel showArrows={false} showThumbs={false} showStatus={false} emulateTouch={true}>
            {
              data.imgList.map((img, idx) => {
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
          data.imgList.length > 0 && data.text.length > 0 && (
            <div className="mb-4"></div>
          )
        }
        <div className="px-4 pb-4">
          <p className="text-black-3">{ data.text }</p>
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  const postList = useSelector(state => state.me.postList)

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
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {
        postList.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(post => {
          return (
            <div key={post.id}>
              <Post data={post} />
            </div>
          )
        })
      }
    </div>
  )
}

export default withRedux(Home)