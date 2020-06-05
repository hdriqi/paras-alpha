import NavTop from 'components/NavTop'

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

const Distribute = ({ onClose, onSubmit }) => {
  return (
    <div className="absolute inset-0 z-30 min-h-screen bg-dark-0">
      <NavTop
        left={
          <button onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#F2F2F2" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M11.9991 13.0607L8.77941 16.2804L7.71875 15.2197L10.9384 12.0001L7.71875 8.78039L8.77941 7.71973L11.9991 10.9394L15.2187 7.71973L16.2794 8.78039L13.0597 12.0001L16.2794 15.2197L15.2187 16.2804L11.9991 13.0607V13.0607Z" fill="white" />
            </svg>
          </button>
        }
        center={
          <h3 className="text-lg font-bold text-white">Choose a Memento</h3>
        }
        right={
          <button>
            New
          </button>
        }
      />
      <div className="px-4">
        <h3 className="text-lg font-bold text-white">My Memento</h3>
        <div>
          {
            _mockMyMemento.map(m => {
              const completeName = m.type === 'personal' ? `${m.name}.${m.owner.split('.')[0]}` : `${m.name}.${m.domain}`
              m.completeName = completeName
              return (
                <div onClick={_ => onSubmit(m)} className="flex items-center my-2 bg-dark-2 rounded-md p-2 cursor-pointer hover:bg-dark-24">
                  <div className="w-6 h-6 rounded-sm overflow-hidden">
                    <img className="w-full h-full object-fill" src="https://res.cloudinary.com/teepublic/image/private/s--g-Leur7F--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_eae0c7,e_outline:48/co_eae0c7,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1479303627/production/designs/824678_1.jpg" />
                  </div>
                  <h4 className="ml-2 font-bold text-white">{completeName}</h4>
                </div>
              )
            })
          }
        </div>
        <h3 className="text-lg font-bold text-white mt-4">Following Memento</h3>
        <div>
          {
            _mockMyFollowingMemento.map(m => {
              const completeName = m.type === 'personal' ? `${m.name}.${m.owner.split('.')[0]}` : `${m.name}.${m.domain}`
              return (
                <div className="flex items-center my-2 bg-dark-2 rounded-md p-2">
                  <div className="w-6 h-6 rounded-sm overflow-hidden">
                    <img className="w-full h-full object-fill" src="https://res.cloudinary.com/teepublic/image/private/s--g-Leur7F--/t_Resized%20Artwork/c_fit,g_north_west,h_954,w_954/co_eae0c7,e_outline:48/co_eae0c7,e_outline:inner_fill:48/co_ffffff,e_outline:48/co_ffffff,e_outline:inner_fill:48/co_bbbbbb,e_outline:3:1000/c_mpad,g_center,h_1260,w_1260/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1479303627/production/designs/824678_1.jpg" />
                  </div>
                  <h4 className="ml-2 font-bold text-white">{completeName}</h4>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default Distribute