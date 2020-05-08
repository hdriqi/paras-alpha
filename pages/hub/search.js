import React from 'react'
import Layout from '../../components/Layout'
import Search from '../../components/search'
import NavMobile from '../../components/navMobile'

const HubSearch = () => {
  return (
    <Layout>
      <Search />
      <div className="fixed bottom-0 right-0 left-0 z-20">
        <NavMobile />
      </div>
    </Layout>
  )
}

export default HubSearch