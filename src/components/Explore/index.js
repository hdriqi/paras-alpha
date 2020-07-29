import NavTop from "components/NavTop"
import PostCard from "components/PostCard"
import PostCardLoader from "components/PostCardLoader"
import { useState } from "react"
import { RotateSpinLoader } from 'react-css-loaders'
import { useSelector } from "react-redux"
import Push from "components/Push"
import Image from "components/Image"
import InfiniteScroll from "react-infinite-scroll-component"
import InfiniteLoader from "components/InfiniteLoader"

const Explore = ({ postListIds, getPost, hasMore, memoryGrant }) => {
  const me = useSelector(state => state.me.profile)
  const [loading, setLoading] = useState(false)

  const _getPost = async () => {
    setLoading(true)
    await getPost()
    setTimeout(() => {
      setLoading(false)
    }, 250)
  }

  return (
    <div className="bg-dark-0 min-h-screen pb-6">
      {
        me.id ? (
          <NavTop
            center={
              <h3 className="text-white text-xl font-bold">Explore</h3>
            }
            right={
              <div>
                <Push href="/hub/search" as="/hub/search">
                  <a className="text-white">
                    <svg className="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" />
                    </svg>
                  </a>
                </Push>
              </div>
            }
          />
        ) : (
            <div className="sticky top-0 z-20 bg-dark-12 px-4">
              <div className="flex justify-between items-center w-full h-12">
                <div className="w-1/3">
                  <Push href="/" as="/">
                    <a>
                      <svg width="72" height="24" viewBox="0 0 72 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.55319 24H5.89858L5.04752 17.4107C8.61322 17.9286 16.1702 18.1393 17.8723 14.8393C19.5745 18.1393 27.1315 17.9286 30.6971 17.4107L29.8461 24H33.1915L35.7447 0L26.41 2.57143C23.2804 3.35714 17.8723 5.85 17.8723 9.53573C17.8723 5.85 12.4642 3.35714 9.33472 2.57143L0 0L2.55319 24ZM4.68078 3.15584C8.08507 4.01298 15.3926 7.0987 17.0947 12.5844C15.2866 15.3159 11.6044 15.2265 9.32392 15.17C9.02827 15.1626 8.7549 15.1558 8.51062 15.1558C3.82979 15.1558 4.49053 3.89494 4.68078 3.15584ZM31.0639 3.15584C27.6596 4.01299 20.3521 7.0987 18.6499 12.5844C20.4581 15.3159 24.1403 15.2265 26.4208 15.17C26.7164 15.1626 26.9898 15.1558 27.2341 15.1558C31.9149 15.1558 31.2541 3.89494 31.0639 3.15584Z" fill="white" />
                        <path d="M45.1465 8.58614V16.0111H38.2246V8.57422L45.1465 8.58614ZM44.4159 15.1249L42.2843 9.72389H39.7695V10.5142H41.1346L39.3024 15.1009L40.0329 15.4003L40.6556 13.8195H43.0507L43.6974 15.4123L44.4159 15.1249ZM42.7514 13.0411H40.967L41.8651 10.8016L42.7514 13.0411Z" fill="white" />
                        <path d="M52.8349 15.3996L46.5238 16.4175L45.2305 8.39387L51.5535 7.37598L52.8349 15.3996ZM51.3859 14.3697L51.2541 13.5434L48.6554 13.9625L47.9129 9.36392L46.5358 9.59147L46.6675 10.4058L47.2303 10.31L47.9728 14.9086L51.3859 14.3697Z" fill="white" />
                        <path d="M55.3056 14.2146C55.5531 14.2146 55.8007 14.1987 56.0481 14.1667C56.2956 14.1268 56.5192 14.055 56.7188 13.9512C56.9184 13.8394 57.082 13.6878 57.2097 13.4961C57.3375 13.2965 57.4014 13.0331 57.4014 12.7057C57.4014 12.3704 57.3135 12.1069 57.1379 11.9154C56.9623 11.7158 56.7387 11.5641 56.4673 11.4603C56.1959 11.3565 55.8925 11.2926 55.5572 11.2686C55.2218 11.2367 54.8985 11.2208 54.5871 11.2208C54.4195 11.2208 54.2558 11.2248 54.0961 11.2327C53.9445 11.2327 53.8047 11.2327 53.677 11.2327L53.6531 11.9632L54.0483 11.9872L53.9643 16.1307H54.6948L54.7548 14.2027C54.8506 14.2107 54.9424 14.2146 55.0302 14.2146C55.1261 14.2146 55.2179 14.2146 55.3056 14.2146ZM56.6589 12.7177C56.6589 12.8853 56.623 13.0211 56.5512 13.1249C56.4872 13.2207 56.3955 13.2965 56.2757 13.3524C56.1639 13.4083 56.0362 13.4482 55.8925 13.4721C55.7487 13.4881 55.6011 13.4961 55.4493 13.4961C55.3536 13.4961 55.2498 13.4961 55.138 13.4961C55.0262 13.4881 54.9024 13.4802 54.7668 13.4721L54.8027 11.9752C55.4414 11.9752 55.9084 12.0192 56.2038 12.1069C56.5072 12.1868 56.6589 12.3903 56.6589 12.7177ZM58.1918 16.969L52.707 16.8612L52.8387 10.6699L58.3236 10.7896L58.1918 16.969Z" fill="white" />
                        <path d="M63.9967 10.9929L63.6853 16.7053L58.7754 16.4538L59.0748 10.7295L63.9967 10.9929ZM63.0985 11.8072L62.5357 11.7833L62.4758 13.2204L60.883 13.1365L60.9549 11.6995L60.0088 11.6635L59.9609 12.2144L60.3682 12.2264L60.2005 15.2682L60.7513 15.3161L60.8352 13.6874L62.4279 13.7713L62.344 15.4L62.9069 15.4239L63.0985 11.8072Z" fill="white" />
                        <path d="M70.9787 7.84301L70.2362 14.4775L64.0449 13.7949L64.7874 7.14844L70.9787 7.84301ZM69.6614 13.6152L68.3081 8.58551L66.0567 8.32203L65.9849 9.02861L67.1945 9.17231L65.0987 13.0764L65.7215 13.4236L66.44 12.0824L68.5716 12.3099L68.9907 13.8069L69.6614 13.6152ZM68.392 11.5914L66.7872 11.4117L67.8291 9.49563L68.392 11.5914Z" fill="white" />
                      </svg>
                    </a>
                  </Push>
                </div>
                <div className="w-1/3">
                  
                </div>
                <div className="w-1/3">
                  <Push href="/login" as="/login">
                    <a className="text-right">
                      <h3 className="text-white text-xl font-bold">Log in</h3>
                    </a>
                  </Push>
                </div>
              </div>
            </div>
          )
      }

      {
        memoryGrant && (
          <div className="p-4 pb-0">
            <Push href="/m/[id]" as={`/m/${memoryGrant.memento.id}`} props={{
              id: memoryGrant.memento.id
            }}>
              <a>
                <div className="mt-2 flex items-center bg-primary-5 rounded-md overflow-hidden">
                  <div className="w-1/5">
                    <div className="pb-full relative">
                      <div className="absolute inset-0">
                        <Image className="w-full rounded-md" data={memoryGrant.memento.img} />
                      </div>
                    </div>
                  </div>
                  <div className="4/5 px-4">
                    <p className="text-white">Contribute to <b>{memoryGrant.memento.id}</b> and get a chance to win ${memoryGrant.reward}</p>
                  </div>
                </div>
              </a>
            </Push>
            <div className="mt-2 text-right">
              <a className="text-sm text-white-2 text-underline hover:text-white font-bold" target="_blank" href="https://paras.id/blog/introducing-memory-grant">Learn more about Memory Grant Program</a>
            </div>
          </div>
        )
      }

      {
        postListIds ? (
          postListIds.length > 0 ? (
            <div className="px-4">
              <InfiniteScroll
                dataLength={postListIds.length}
                next={getPost}
                hasMore={hasMore}
                loader={<InfiniteLoader key={0} />}
              >
                {
                  postListIds.map(id => {
                    return (
                      <div className="mt-6" key={id}>
                        <PostCard id={id} />
                      </div>
                    )
                  })
                }
              </InfiniteScroll>
            </div>
          ) : (
              <div className="mt-6">
                <div className="p-4 bg-dark-0 text-center">
                  <p className="tracking-tight text-white">Jump into a memento! <br />Create or discover the digital collective memory</p>
                  <div className="flex flex-wrap justify-center">
                    {
                      RECOMMENDATIONS.map(rec => {
                        return (
                          <Push href="/m/[id]" as={`/m/${rec.id}`} props={{
                            id: rec.id,
                            fetch: true
                          }}>
                            <a>
                              <p className="p-2 text-sm bg-primary-5 text-white mx-2 mt-4 rounded-md">{rec.name}</p>
                            </a>
                          </Push>
                        )
                      })
                    }
                  </div>
                </div>
              </div>
            )
        ) : (
            <div>
              <div className="px-4 pt-6">
                <PostCardLoader />
              </div>
              <div className="px-4 pt-6">
                <PostCardLoader />
              </div>
              <div className="px-4 pt-6">
                <PostCardLoader />
              </div>
            </div>
          )
      }
    </div>
  )
}

export default Explore