import { useState } from "react"
import { withRedux } from "../lib/redux"
import Push from "./Push"
import Pop from "./Pop"
import Fuse from 'fuse.js'
import near from "../lib/near"
import Image from "./Image"

const Search = () => {
  const [userList, setUserList] = useState([])

  const [searchText, setSearchText] = useState('')
  const [beginSearch, setBeginSearch] = useState(null)

  const _getUsers = async (query) => {
    if(query.length > 0) {
      const searchList = await near.contract.searchPostAndMemento({
        query: query
      })
      const fuse = new Fuse(searchList, {
        includeScore: true,
        keys: ['title']
      })
      const result = fuse.search(query).map(res => res.item)
      setUserList(result)
    }
  }

  const _search = (val) => {
    clearTimeout(beginSearch)
    setSearchText(val)
    setBeginSearch(setTimeout(() => {
      _getUsers(val)
    }, 500))
  }

  return (
    <div className="bg-white-1 min-h-screen">
      <div className="pb-12">
        <div className="fixed bg-white shadow-subtle top-0 left-0 right-0 h-12 px-4">
          <div className="relative w-full h-full flex items-center">
            <div>
              <Pop>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.41412 12L16.707 19.2929L15.2928 20.7071L6.58569 12L15.2928 3.29291L16.707 4.70712L9.41412 12Z" fill="#222"/>
                </svg>
              </Pop>
            </div>
            <div className="pl-4 w-full">
              <input autoFocus value={searchText} onChange={e => _search(e.target.value)} className="outline-none font-medium w-full" placeholder="Search" />
            </div>
          </div>
        </div>
      </div>
      <div>
        {
          userList.map(data => {
            return (
              <div key={data.id}>
                {
                  data.type === 'user' ? (
                    <Push href="/[username]" as={ `/${data.id}` } props={{
                      username: data.id
                    }}>
                      <a>
                        <div className="flex items-center bg-white shadow-subtle mt-4 p-4">
                          <div>
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <Image style={{
                                boxShadow: `0 0 4px 0px rgba(0, 0, 0, 0.75) inset`
                              }} className="object-cover w-full h-full" data={data.img} />
                            </div>
                          </div>
                          <div className="px-4 w-auto overflow-hidden">
                            <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{ data.title }</p>
                            <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{ data.subtitle }</p>
                          </div>
                        </div>
                      </a>
                    </Push>
                  ) : (
                    <Push href="/m/[id]" as={ `/m/${data.id}` } props={{
                      id: data.id
                    }}>
                      <a>
                        <div className="flex items-center bg-white shadow-subtle mt-4 p-4">
                          <div>
                            <div className='flex items-center w-8 h-8 rounded-full overflow-hidden bg-black-1'>
                              <div className='w-4 h-4 m-auto bg-white'></div>
                            </div>
                          </div>
                          <div className='px-4 w-auto overflow-hidden'>
                            <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{ data.title }</p>
                            <p className="text-black-3 text-sm truncate whitespace-no-wrap min-w-0">{ data.subtitle }</p>
                          </div>
                        </div>
                      </a>
                    </Push>
                  )
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default withRedux(Search)