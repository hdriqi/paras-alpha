import Link from 'next/link'
import { Carousel } from 'react-responsive-carousel'

const Post = ({ post }) => {
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
        <div className="flex items-center p-4">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img className="object-cover w-full h-full" src={post.user.avatarUrl} />
          </div>
          <div className="px-4">
            <Link href="/[username]" as={ post.user.username }>
              <p className="font-semibold text-black-1">{ post.user.username }</p>
            </Link>
            <p>in&nbsp;
              <Link href="/block/[id]" as={ `/block/${post.blockId}` }>
                <span className="font-semibold text-black-1">{ post.block.name }</span>
              </Link>
            </p>
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
              post.imgList.length > 0 && post.body.length > 0 && (
                <div className="mb-4"></div>
              )
            }
            <div className="px-4 pb-4">
              <p className="text-black-3 whitespace-pre-line">{ post.body }</p>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default Post