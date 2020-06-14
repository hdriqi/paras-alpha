import NavTop from 'components/NavTop'
import Pop from 'components/Pop'
import InfiniteScroll from 'react-infinite-scroll-component'
import InfiniteLoader from 'components/InfiniteLoader'
import Image from 'components/Image'
import Push from 'components/Push'
import Follow from './Follow'

const ProfileMemento = ({ mementoList }) => {
  return (
    <div className="bg-dark-0 min-h-screen">
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
          <h3 className="text-lg font-bold text-white px-2">My Memento</h3>
        }
        right={
          <button onClick={_ => setShowModal(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z" fill="#E2E2E2" />
              <path d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z" fill="#E2E2E2" />
              <path d="M8 12C8 13.1046 7.10457 14 6 14C4.89543 14 4 13.1046 4 12C4 10.8954 4.89543 10 6 10C7.10457 10 8 10.8954 8 12Z" fill="#E2E2E2" />
            </svg>
          </button>
        }
      />
      <div className="px-4">
        {
          mementoList.length > 0 ? (
            mementoList.sort((a, b) => a.id.localeCompare(b.id)).map(m => {
              return (
                <div key={m.id}>
                  <Push href="/m/[id]" as={`/m/${m.id}`} props={{
                    id: m.id,
                    fetch: true
                  }}>
                    <div className="flex items-center mt-4 bg-dark-2 rounded-md p-2 cursor-pointer hover:bg-dark-24">
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
                </div>
              )
            })
          ) : (
              <div className="text-center mt-2 p-2 ">
                <h4 className="text-white text-lg font-semibold">Empty Memento</h4>
                <p className="text-white-1 pt-2">Click on button at top right to add Memento</p>
              </div>
            )
        }
      </div>
    </div>
  )
}

export default ProfileMemento