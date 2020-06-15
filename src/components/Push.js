import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { withRedux } from '../lib/redux'
import { pushPage } from '../actions/ui'
import { Fragment, cloneElement } from 'react'

const Push = ({ href, as, props, children, component }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const _navigate = (e) => {
    if(router.asPath === as) {
      e.preventDefault()
      return
    }

    if (!!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)) {
      return
    }
    else {
      e.preventDefault()

      dispatch(pushPage({
        href: href,
        url: as,
        props: props,
        component: component
      }))
      if(href) {
        router.push({ pathname: href }, as, {
          shallow: true
        })
      }
    }
  }

  return (
    <Fragment>
      { cloneElement(children, { onClick: e => {_navigate(e)}, href: as }) }
    </Fragment>
  )
}

export default withRedux(Push)