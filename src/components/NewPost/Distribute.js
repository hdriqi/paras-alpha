import NavTop from 'components/NavTop'
import { useEffect, useState, Fragment, useRef } from 'react'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock'
import Scrollbars from 'react-custom-scrollbars'
import NewMemento from 'components/NewMemento'
import Push from 'components/Push'
import Pop from 'components/Pop'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import initials from 'initials'
import Image from 'components/Image'

const _mockMyMemento = [
  {
    img: `https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png`,
    name: 'work',
    domain: 'general',
    type: 'personal',
    owner: 'johndoe.testnet',
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    createdAt: 1591082951638
  },
  {
    img: `https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png`,
    name: 'blog',
    domain: 'general',
    type: 'personal',
    owner: 'johndoe.testnet',
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    createdAt: 1591082951638
  }
]
const _mockMyFollowingMemento = [
  {
    img: `https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png`,
    name: 'linuxdesktopoholic',
    domain: 'tech',
    type: 'public',
    owner: 'johndoe.testnet',
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    createdAt: 1591082951638
  },
  {
    img: `https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png`,
    name: 'linuxdesktopoholic',
    domain: 'tech',
    type: 'public',
    owner: 'johndoe.testnet',
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    createdAt: 1591082951638
  },
  {
    img: `https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png`,
    name: 'linuxdesktopoholic',
    domain: 'tech',
    type: 'public',
    owner: 'johndoe.testnet',
    desc: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    createdAt: 1591082951638
  }
]

const Distribute = ({ onClose, onSelect }) => {
  const router = useRouter()
  const mementoList = useSelector(state => state.me.mementoList)

  const _createMementoOnComplete = (data) => {
    console.log(data)
    router.back()
  }

  const NewMementoComp = () => {
    return (
      <NewMemento
        onComplete={_createMementoOnComplete}
      />
    )
  }

  return (
    <Fragment>
      <div id="new-post-distribute" className="min-h-screen bg-dark-0">
        <NavTop
          left={
            <Pop>
              <button>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F2F2F2" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.9991 13.0607L8.77941 16.2804L7.71875 15.2197L10.9384 12.0001L7.71875 8.78039L8.77941 7.71973L11.9991 10.9394L15.2187 7.71973L16.2794 8.78039L13.0597 12.0001L16.2794 15.2197L15.2187 16.2804L11.9991 13.0607V13.0607Z" fill="white" />
                </svg>
              </button>
            </Pop>
          }
          center={
            <h3 className="text-lg font-bold text-white px-2">Choose a Memento</h3>
          }
          right={
            <Push
              href="/new/memento"
              as="/new/memento"
              component={NewMementoComp}
            >
              <button>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="15" fill="#E13128" stroke="#E13128" stroke-width="2" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M14.5408 22.3337V17.4598H9.66699V14.5408H14.5408V9.66699H17.4598V14.5408H22.3337V17.4598H17.4598V22.3337H14.5408Z" fill="white" />
                </svg>
              </button>
            </Push>
          }
        />
        <div className="px-4 py-4">
          <h3 className="text-lg font-bold text-white">My Memento</h3>
          <div>
            {
              mementoList.length > 0 ? (
                mementoList.map(m => {
                  return (
                    <div key={m.id} onClick={_ => onSelect(m)} className="flex items-center my-2 bg-dark-2 rounded-md p-2 cursor-pointer hover:bg-dark-24">
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
                      <h4 className="ml-2 font-bold text-white">{m.id}</h4>
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
      </div>
    </Fragment>
  )
}

export default Distribute