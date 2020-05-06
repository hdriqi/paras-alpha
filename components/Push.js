import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { withRedux } from '../lib/redux'
import { pushPage } from '../actions/ui'

const Push = ({ href, as, query, page, props, children }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const _navigate = () => {
    if(router.asPath === as) {
      return
    }
    dispatch(pushPage({
      url: as,
      component: page,
      props: props
    }))
    router.push({ pathname: router.pathname, query: query }, as, {
      shallow: true
    })
  }

  return (
    <span onClick={_ => _navigate()}>
      { children }
    </span>
  )
}

export default withRedux(Push)