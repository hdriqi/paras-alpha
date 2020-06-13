import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { withRedux } from '../lib/redux'
import { Fragment, cloneElement } from 'react'

const Pop = ({ children }) => {
  const pageList = useSelector(state => state.ui.pageList)
  const router = useRouter()

  const _navigate = () => {
    console.log('hello')
    router.back()
  }

  return (
    <Fragment>
      { cloneElement(children, { onClick: e => {_navigate(e)} }) }
    </Fragment>
  )
}

export default withRedux(Pop)