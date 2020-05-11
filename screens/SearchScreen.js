import React from 'react'
import Search from '../components/Search'
import NavMobile from '../components/NavMobile'

const HubSearch = () => {
  return (
    <div>
      <Search />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </div>
  )
}

export default HubSearch