import { Fragment } from "react"
import Head from 'next/head'

const Layout = ({ children }) => {
  return (
    <Fragment>
      <Head>
        <title>Paras</title>
      </Head>
      { children }
    </Fragment>
  )
}

export default Layout