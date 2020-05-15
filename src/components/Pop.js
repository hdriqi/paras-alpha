import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { withRedux } from '../lib/redux'
import { popPage } from '../actions/ui'
import { Fragment, cloneElement } from 'react'

const Pop = ({ children }) => {
  const pageList = useSelector(state => state.ui.pageList)
  const router = useRouter()
  const dispatch = useDispatch()

  const _navigate = () => {
    if(pageList.length === 0) {
      router.push('/', '/')
    }
    else {
      dispatch(popPage())
      router.back()
    }
  }

  return (
    <Fragment>
      { cloneElement(children, { onClick: e => {_navigate(e)} }) }
    </Fragment>
  )
}

export default withRedux(Pop)