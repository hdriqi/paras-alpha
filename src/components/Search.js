import { useState } from "react"
import { withRedux } from "../lib/redux"
import Push from "./Push"
import Pop from "./Pop"
import Image from "./Image"
import axios from 'axios'
import NavTop from "./NavTop"

const Search = () => {
  const [itemList, setItemList] = useState([])

  const [searchText, setSearchText] = useState('')
  const [beginSearch, setBeginSearch] = useState(null)

  const _getUsers = async (query) => {
    if (query.length > 0) {
      const response = await axios.get(`${process.env.BASE_URL}/search?id__re=${query}`)
      setItemList(response.data.data)
    }
  }

  const _search = (val) => {
    clearTimeout(beginSearch)
    setSearchText(val)
    if (val.length === 0) {
      setItemList([])
    }
    setBeginSearch(setTimeout(() => {
      _getUsers(val)
    }, 500))
  }

  return (
    <div className="bg-dark-0 min-h-screen">
      <NavTop
        left={
          <Pop>
            <a>
              <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#F2F2F2" />
                <path fillRule="evenodd" clipRule="evenodd" d="M14.394 9.93934C14.9798 10.5251 14.9798 11.4749 14.394 12.0607L11.6213 14.8333H24C24.8284 14.8333 25.5 15.5049 25.5 16.3333C25.5 17.1618 24.8284 17.8333 24 17.8333H11.6213L14.394 20.606C14.9798 21.1918 14.9798 22.1415 14.394 22.7273C13.8082 23.3131 12.8585 23.3131 12.2727 22.7273L6.93934 17.394C6.65804 17.1127 6.5 16.7312 6.5 16.3333C6.5 15.9355 6.65804 15.554 6.93934 15.2727L12.2727 9.93934C12.8585 9.35355 13.8082 9.35355 14.394 9.93934Z" fill="#F2F2F2" />
              </svg>
            </a>
          </Pop>
        }
        center={
          <div className="text-white text-xl font-bold">
            <input autoFocus value={searchText} onChange={e => _search(e.target.value)} className="w-full rounded-md p-2 outline-none bg-dark-2 focus:bg-dark-4 text-white text-sm" placeholder="Search" />
          </div>
        }
      />
      <div>
        {
          itemList.map((data, idx) => {
            return (
              <div className="mt-4 mx-4" key={idx}>
                {
                  data.type === 'user' ? (
                    <Push href="/[id]" as={`/${data.id}`} props={{
                      username: data.id
                    }}>
                      <a className="">
                        <div className="flex items-center bg-dark-2 p-2 rounded-md">
                          <div className="h-10 w-10 rounded-full overflow-hidden shadow-inner">
                            <Image className="object-fill" data={data.img} />
                          </div>
                          <div className="ml-2">
                            <h4 className="text-white font-bold">{data.id}</h4>
                          </div>
                        </div>
                      </a>
                    </Push>
                  ) : (
                      <Push href="/m/[id]" as={`/m/${data.id}`} props={{
                        id: data.id,
                        fetch: true
                      }}>
                        <a className="">
                          <div className="flex items-center bg-dark-2 p-2 rounded-md">
                            <div className="h-10 w-10 rounded-full overflow-hidden shadow-inner">
                              <Image className="object-fill" data={data.img} />
                            </div>
                            <div className="ml-2">
                              <h4 className="text-white font-bold">{data.id}</h4>
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