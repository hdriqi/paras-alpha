import { useState, useEffect, useRef } from "react"
import { withRedux } from "../lib/redux"
import { useSelector, useDispatch } from "react-redux"
import { toggleNewPost, toggleNewBlock, toggleHubSearch } from "../actions/ui"
import { readFileAsUrl } from "../lib/utils"
import { addPostList, addBlockList } from "../actions/me"
import axios from "axios"

import { MentionsInput, Mention } from 'react-mentions'

const NewPost = () => {
  const showHubSearch = useSelector(state => state.ui.showHubSearch)
  const dispatch = useDispatch()

  const _getUsers = async (query, callback) => {
    if (!query) return
    const response = await axios.get(`http://localhost:3004/users?username_like=${query}`)
    const list = response.data.map(user => ({ display: `@${user.username}`, id: user.id }))
    callback(list)
  }

  const _close = () => {
    dispatch(toggleHubSearch(false))
  }

  return (
    showHubSearch && (
      <div className="fixed bg-white inset-0 z-30 px-4">
        <div className="pt-12">
          <div className="fixed top-0 left-0 right-0 h-12 px-4">
            <div className="relative w-full h-full flex items-center">
              <div>
                <svg onClick={e => _close()} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 14.1214L5.56068 20.5607L3.43936 18.4394L9.8787 12.0001L3.43936 5.56071L5.56068 3.43939L12 9.87873L18.4394 3.43939L20.5607 5.56071L14.1213 12.0001L20.5607 18.4394L18.4394 20.5607L12 14.1214Z" fill="#222222"/>
                </svg>
              </div>
              <div>
                <input />
              </div>
            </div>
          </div>
      </div>
    </div>
    )
  )
}

export default withRedux(NewPost)