import React from 'react'
import NavMobile from '../components/NavMobile'
import HomeScreen from '../screens/HomeScreen'

const HomePage = () => {
  return (
    <div>
      <HomeScreen />
      <div className="sticky bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </div>
  )
}

export default HomePage
