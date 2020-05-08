import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { pushPage } from '../actions/ui'
import { forwardRef } from 'react'

const PushForward = ({ href, as, props, children }, ref) => {
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
      <a ref={ref} onClick={e => {_navigate(e); return false}} href={as}>{ children }</a>
    </span>
  )
}

export default forwardRef(PushForward)