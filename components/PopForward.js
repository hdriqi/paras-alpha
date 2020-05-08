import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { popPage } from '../actions/ui'
import { forwardRef } from 'react'

const PopForward = (props, ref) => {
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
    <span ref={ref} onClick={_ => _navigate()}>
      { props.children }
    </span>
  )
}

export default forwardRef(PopForward)