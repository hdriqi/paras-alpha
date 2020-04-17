import { useState, useEffect } from "react"
import { withRedux } from "../lib/redux"
import { useSelector, useDispatch, batch } from "react-redux"
import Link from 'next/link'
import axios from "axios"
import { useRouter } from "next/router"
import { addData } from "../actions/me"

const Search = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const userList = useSelector(state => state.me.data[`${router.asPath}_userList`])
  const cacheSearchText = useSelector(state => state.me.data[`${router.asPath}_searchText`])

  const [searchText, setSearchText] = useState('')
  const [beginSearch, setBeginSearch] = useState(null)

  const _getUsers = async (query) => {
    if(query.length > 0) {
      const response = await axios.get(`http://localhost:3004/users?username_like=${query}`)
      batch(() => {
        dispatch(addData(`${router.asPath}_userList`, response.data))
        dispatch(addData(`${router.asPath}_searchText`, query))
      })
    }
  }

  useEffect(() => {
    if(cacheSearchText) {
      setSearchText(cacheSearchText)
    }
  }, [])

  const _search = (val) => {
    clearTimeout(beginSearch)
    setSearchText(val)
    setBeginSearch(setTimeout(() => {
      _getUsers(val)
    }, 500))
  }

  const _close = () => {
    batch(() => {
      dispatch(addData(`${router.asPath}_userList`, null))
      dispatch(addData(`${router.asPath}_searchText`, null))
    })
    router.back()
  }

  return (
    <div className="fixed bg-white inset-0 z-30">
      <div className="pb-16">
        <div className="fixed top-0 left-0 right-0 h-12 px-4">
          <div className="relative w-full h-full flex items-center">
            <div>
              <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
              </svg>
            </div>
            <div className="pl-4 w-full">
              <input autoFocus value={searchText} onChange={e => _search(e.target.value)} className="outline-none font-medium w-full" placeholder="Search" />
            </div>
          </div>
        </div>
      </div>
      <div>
        {
          userList && userList.map(user => {
            return (
              <div key={user.id} className="flex items-center bg-white p-4 overflow-hidden">
                <div>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img style={{
                      boxShadow: `0 0 4px 0px rgba(0, 0, 0, 0.75) inset`
                    }} className="object-cover w-full h-full" src={user.avatarUrl} />
                  </div>
                </div>
                <div className="px-4 w-auto">
                  <Link href="/[username]" as={ `/${user.username}` }>
                    <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{ user.username }</p>
                  </Link>
                  <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{ user.bio }</p>
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default withRedux(Search)