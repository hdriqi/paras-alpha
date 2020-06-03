import { useRef, useState, useEffect } from 'react'
import { MentionsInput, Mention } from 'react-mentions'

const textareaStyle = {
  control: {
    fontSize: `16px`,
    fontWeight: `500`,
    color: '#616161'
  },
  input: {
    margin: 0,
    padding: `0 .5rem`,
    overflow: `hidden`,
    color: `white`,
  },
  suggestions: {
    marginTop: `20px`,
    maxHeight: `32rem`,
    overflowY: 'auto',
    width: `100vw`,
    maxWidth: `100%`,
    boxShadow: `0px 0px 4px rgba(0, 0, 0, 0.15)`
  },
}

const RenderUser = (entry) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-dark-0 h-16">
      <div className="w-8/12 flex items-center overflow-hidden">
        <div>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image style={{
              boxShadow: `0 0 4px 0px rgba(0, 0, 0, 0.75) inset`
            }} className="object-cover w-full h-full" data={entry.imgAvatar} />
          </div>
        </div>
        <div className="px-4 w-auto">
          <p className="font-semibold text-black-1 truncate whitespace-no-wrap min-w-0">{entry.username}</p>
        </div>
      </div>
    </div>
  )
}

const NewPostText = ({ left, right, input = '' }) => {
  const offsetY = 16

  const inputRef = useRef(null)
  const [textRaw, setTextRaw] = useState(input || '')
  const [curText, setCurText] = useState(input || '')
  const [lineCount, setLineCount] = useState(0)
  const [err, setErr] = useState(false)

  useEffect(() => {
    const maxHeight = inputRef.current.offsetWidth - offsetY
    if (inputRef.current.scrollHeight > maxHeight) {
      setTextRaw(curText)
      setErr(true)
      setTimeout(() => {
        setErr(false)
      }, 500)
    }
    if (textRaw.length > 0) {
      const lineCount = Math.round(inputRef.current.scrollHeight * 100 / maxHeight)
      setLineCount(lineCount)
    }
    else {
      setLineCount(0)
    }
  }, [textRaw])

  const _getUsers = async (query, callback) => {
    if (!query) return
    const q = [`username_like:=${query}`]
    const userList = await near.contract.getUserList({
      query: q,
      opts: {
        _embed: true,
        _sort: 'createdAt',
        _order: 'desc',
        _limit: 10
      }
    })
    const list = userList.map(user => ({
      display: `@${user.username}`,
      id: user.id,
      imgAvatar: user.imgAvatar,
      username: user.username
    }))
    callback(list)
    const suggestionsEl = document.querySelector('.outline-none__suggestions')
    if (suggestionsEl) {
      suggestionsEl.scrollTo(0, suggestionsEl.scrollHeight)
    }
  }

  const _onChange = (val) => {
    setCurText(textRaw)
    setTextRaw(val)
  }

  const _left = () => {
    left()
  }

  const _right = () => {
    right({
      type: 'text',
      body: textRaw,
      payload: {
        text: inputRef.current.value,
        raw: textRaw
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50" style={{
      backgroundColor: `rgba(0,0,0,0.8)`
    }}>
      <div className="max-w-sm m-auto p-4 flex items-center h-full w-full">
        <div className="bg-dark-1 w-full rounded-md overflow-hidden">
          <div className="flex justify-between items-center w-full h-12 bg-dark-4 px-2">
            <div className="w-8 text-white">
              <svg onClick={_ => _left()} width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="white" />
                <path fillRule="evenodd" clipRule="evenodd" d="M15.9999 17.6979L10.8484 22.8494L9.15137 21.1523L14.3028 16.0009L9.15137 10.8494L10.8484 9.15234L15.9999 14.3038L21.1514 9.15234L22.8484 10.8494L17.697 16.0009L22.8484 21.1523L21.1514 22.8494L15.9999 17.6979Z" fill="white" />
              </svg>
            </div>
            <div className="flex-auto text-white overflow-hidden px-2">Add Text</div>
            <div className="w-8 text-white">
              <svg onClick={_ => _right()} className="ml-auto" width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 23.732 8.26801 30 16 30ZM16 32C24.8366 32 32 24.8366 32 16C32 7.16344 24.8366 0 16 0C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32Z" fill="#E13128" />
                <path fillRule="evenodd" clipRule="evenodd" d="M13.7061 19.2929L22.999 10L24.4132 11.4142L13.7061 22.1213L7.99902 16.4142L9.41324 15L13.7061 19.2929Z" fill="#E13128" />
              </svg>
            </div>
          </div>
          <div className="h-1 w-full relative bg-dark-12 relative">
            <div className="h-full absolute top-0 left-0 bg-primary-5" style={{
              width: `${lineCount}%`
            }}></div>
          </div>
          <div className="w-full relative pb-full">
            <div className="absolute m-auto w-full h-full object-contain">
              <div className={`
                ${err && 'animated shake'}
                flex items-center h-full
              `}>
                <MentionsInput className="outline-none w-full max-w-full"
                  style={textareaStyle}
                  placeholder="Share your ideas, thought and creativity"
                  onChange={e => _onChange(e.target.value)}
                  value={textRaw}
                  allowSuggestionsAboveCursor={true}
                  inputRef={inputRef}
                >
                  <Mention
                    trigger='@'
                    data={_getUsers}
                    appendSpaceOnAdd={true}
                    style={{
                      color: '#1B1B1B'
                    }}
                    renderSuggestion={RenderUser}
                  />
                </MentionsInput>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewPostText