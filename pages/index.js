import React from 'react'
import NavMobile from '../components/navMobile'
import Layout from '../components/layout'
import Home from '../components/home'

const HomePage = () => {
  return (
    <Layout>
      <Home />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

export default HomePage