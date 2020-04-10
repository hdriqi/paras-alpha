import Link from 'next/link'

const Profile = ({ user, blockList }) => {
  return (
    <div className="min-h-screen">
      <div className="pt-12">
        <div className="fixed top-0 left-0 right-0 h-12 px-4 bg-white shadow-subtle">
          <div className="relative w-full h-full flex items-center justify-center">
            <div>
              <h3 className="text-2xl font-bold text-black-1 tracking-tighter">Profile</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-6">
        <div className="text-center">
          <img className="m-auto w-20 h-20 rounded-full overflow-hidden object-cover" src={user.avatarUrl} />
          <h4 className="mt-4 text-2xl font-bold">{user.username}</h4>
          <p className="text-black-3">{user.bio}</p>
        </div>
        <div>
          {
            blockList.map(block => {
              return (
                <div className="mt-6" key={block.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-2xl font-bold">{block.name}</h4>
                    </div>
                    <div>
                      <Link href="/block/[id]" as={`/block/${block.id}`}>
                        <p className="font-semibold text-black-4 text-sm">View All</p>
                      </Link>
                    </div>
                  </div>
                  <div className="flex mt-1 -ml-2 -mr-2 justify-between">
                    {
                      block.postList.map(post => {
                        return (
                          <Link key={post.id} href="/post/[id]" as={`/post/${post.id}`}>
                            <div className="w-1/3">
                              <div className="w-full relative pb-full">
                                <div className="absolute inset-0 px-1">
                                  <div className="w-full h-full shadow-subtle bg-white overflow-hidden rounded-md">
                                    {
                                      post.imgList.length > 0 ? (
                                        <img className="w-full h-full object-cover" src={post.imgList[0].url} />
                                      ) : (
                                        <div className="p-1">
                                          <p className="leading-tight text-xs">{post.body}</p>
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        )
                      })
                    }
                    {
                      [...Array(Math.max(0, Math.abs(3 - block.postList.length))).keys()].map(key => {
                        return (
                          <div key={key} className="w-1/3 p-1 overflow-hidden"></div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Profile