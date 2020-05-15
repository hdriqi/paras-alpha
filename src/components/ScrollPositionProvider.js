import React, { useEffect, useContext } from 'react'
import Router from 'next/router'

export const ScrollPositionContext = React.createContext({
  triggerScroll: () => null,
})

export const useScrollPosition = () => useContext(ScrollPositionContext)

let isBack = false
const routes = []

const ScrollPositionProvider = ({ children }) => {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleChangeStart = () => {
      routes.unshift({pathname: Router.asPath, x: window.scrollX || window.pageXOffset, y: window.scrollY || window.pageYOffset})
    }

    const handleChangeComplete = () => {
      let x = 0
      let y = 0 

      const routeIdx = routes.findIndex(route => route.pathname === Router.asPath)
      if(routeIdx > -1) {
        x = routes[routeIdx].x
        y = routes[routeIdx].y
      }
      window.requestAnimationFrame(() => window.scrollTo(x, y))
    }

    window.onpopstate = () => {
      routes.shift()
      routes.shift()
    }

    Router.events.on('routeChangeStart', handleChangeStart)
    Router.events.on('routeChangeComplete', handleChangeComplete)
  }, [])

  return (
    <ScrollPositionContext.Provider>
      {children}
    </ScrollPositionContext.Provider>
  )
}

export default ScrollPositionProvider