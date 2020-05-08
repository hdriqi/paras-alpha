import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { withRedux } from '../lib/redux'
import { pushPage } from '../actions/ui'
import Link from 'next/link'

const Push = ({ href, as, query, props, children }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const _navigate = (e) => {
    if(router.asPath === as) {
      e.preventDefault()
      return
    }

    if (!!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)) {
      return
    }
    else {
      e.preventDefault()

      dispatch(pushPage({
        href: href,
        url: as,
        props: props
      }))
      router.push({ pathname: href }, as, {
        shallow: true
      })
    }
  }

  return (
    <span>
      <a onClick={e => {_navigate(e); return false}} href={as}>{ children }</a>
    </span>
  )
}

export default withRedux(Push)