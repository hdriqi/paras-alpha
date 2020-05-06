import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { withRedux } from '../lib/redux'
import { popPage } from '../actions/ui'

const Pop = ({ href, as, query, opts, page, children }) => {
  const pageList = useSelector(state => state.ui.pageList)
  const router = useRouter()
  const dispatch = useDispatch()

  const _navigate = () => {
    dispatch(popPage())
    router.back()
  }

  return (
    <div onClick={_ => _navigate()}>
      { children }
    </div>
  )
}

export default withRedux(Pop)