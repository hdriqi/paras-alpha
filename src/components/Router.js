import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { popPage } from '../actions/ui'

export function usePopRouter() {
  const router = useRouter()
  const dispatch = useDispatch()

  const _navigate = () => {
    dispatch(popPage())
    router.back()
  }

  return _navigate
}