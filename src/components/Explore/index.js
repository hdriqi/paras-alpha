import NavTop from "components/NavTop"
import PostCard from "components/PostCard"
import PostCardLoader from "components/PostCardLoader"
import { useState } from "react"
import { RotateSpinLoader } from 'react-css-loaders'
import { useSelector } from "react-redux"
import Push from "components/Push"
import Image from "components/Image"

const Explore = ({ post, getPost, memoryGrant }) => {
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
              <div className="flex items-center">
                {
                  loading ? (
                    <button>
                      <RotateSpinLoader style={{
                        margin: `auto`
                      }} color="#E13128" size={2.8} />
                    </button>
                  ) : (
                      <button onClick={_getPost}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="16" cy="16" r="16" fill="#E13128" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M20.6548 12.6667L20.1744 12.6667C18.4909 12.6824 17.8079 13.402 16.7075 15.8032C16.5838 16.0738 16.5181 16.2175 16.4565 16.3505C14.9799 19.5408 13.4698 20.9492 10.1667 21.0001H8.5V19.3334L10.1538 19.3335C12.6648 19.2947 13.7072 18.3226 14.944 15.6504C15.0038 15.5212 15.0678 15.3814 15.1923 15.1089C16.5365 12.1758 17.6301 11.0236 20.1667 11.0001H20.6548L19.5774 9.92265L20.7559 8.74414L23.8452 11.8334L20.7559 14.9227L19.5774 13.7441L20.6548 12.6667ZM20.6547 20.9999H20.1665C18.5557 20.985 17.5268 20.5148 16.6461 19.4226C16.9731 18.9525 17.28 18.4307 17.5757 17.857C18.2759 18.9497 18.9685 19.3221 20.1743 19.3333L20.6547 19.3333L19.5773 18.2558L20.7558 17.0773L23.8451 20.1666L20.7558 23.2558L19.5773 22.0773L20.6547 20.9999ZM10.1538 12.6665C11.8518 12.6927 12.8782 13.1457 13.7473 14.2626C14.0205 13.6753 14.292 13.1436 14.572 12.666C13.4983 11.555 12.1585 11.0307 10.1667 11H8.5V12.6666L10.1538 12.6665Z" fill="white" />
                        </svg>
                      </button>
                    )
                }

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
                  <div className="flex items-center justify-center">
                    <button onClick={_getPost}>
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="16" fill="#E13128" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M20.6548 12.6667L20.1744 12.6667C18.4909 12.6824 17.8079 13.402 16.7075 15.8032C16.5838 16.0738 16.5181 16.2175 16.4565 16.3505C14.9799 19.5408 13.4698 20.9492 10.1667 21.0001H8.5V19.3334L10.1538 19.3335C12.6648 19.2947 13.7072 18.3226 14.944 15.6504C15.0038 15.5212 15.0678 15.3814 15.1923 15.1089C16.5365 12.1758 17.6301 11.0236 20.1667 11.0001H20.6548L19.5774 9.92265L20.7559 8.74414L23.8452 11.8334L20.7559 14.9227L19.5774 13.7441L20.6548 12.6667ZM20.6547 20.9999H20.1665C18.5557 20.985 17.5268 20.5148 16.6461 19.4226C16.9731 18.9525 17.28 18.4307 17.5757 17.857C18.2759 18.9497 18.9685 19.3221 20.1743 19.3333L20.6547 19.3333L19.5773 18.2558L20.7558 17.0773L23.8451 20.1666L20.7558 23.2558L19.5773 22.0773L20.6547 20.9999ZM10.1538 12.6665C11.8518 12.6927 12.8782 13.1457 13.7473 14.2626C14.0205 13.6753 14.292 13.1436 14.572 12.666C13.4983 11.555 12.1585 11.0307 10.1667 11H8.5V12.6666L10.1538 12.6665Z" fill="white" />
                      </svg>
                    </button>
                  </div>
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
        !loading ? (
          <div className="px-4 pt-6" key={post.id}>
            <PostCard id={post.id} />
          </div>
        ) : (
            <div>
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