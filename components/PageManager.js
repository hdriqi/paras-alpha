import { withRedux } from '../lib/redux'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

const PageManager = ({ children }) => {
  const pageList = useSelector(state => state.ui.pageList)

  useEffect(() => {
    console.log(pageList)
  }, [pageList])

  return (
    <div>
      <div className={pageList.length === 0 ? 'block' : 'hidden'} id="page-root">
        { children }
      </div>
      {
        pageList.map((page, idx) => {
          return (
            <div className={pageList.length === idx + 1 ? 'block' : 'hidden'} id={`page-${idx}`} style={{
              zIndex: 100 + idx
            }}>
              <page.component {...page.props} />
            </div>
          )
        })
      }
    </div>
  )
}

export default withRedux(PageManager)