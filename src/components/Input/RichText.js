import { MentionsInput, Mention } from 'react-mentions'
import near from '../../lib/near'
import Image from 'components/Image'
import { mergeDeep } from 'lib/utils'
import axios from 'axios'

const defaultStyle = {
  control: {
    fontSize: `16px`,
    fontWeight: `400`,
    color: '#616161'
  },
  highlighter: {
    letterSpacing: `0`
  },
  input: {
    margin: 0,
    padding: `0`,
    color: `white`,
    height: `100%`
  },
  suggestions: {
    marginTop: `1rem`,
    maxHeight: `8rem`,
    overflowY: 'auto',
    left: `auto`,
    right: `auto`,
    width: `100%`,
    maxWidth: `100%`,
    boxShadow: `0px 0px 4px rgba(0, 0, 0, 0.15)`,
    backgroundColor: `#121212`,
    item: {
      '&focused': {
        backgroundColor: '#333333',
      },
    },
  },
}

const RenderUser = (entry) => {
  return (
    <div className="flex items-center justify-between p-2">
      <div className="w-8/12 flex items-center overflow-hidden">
        <div>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image style={{
              boxShadow: `0 0 4px 0px rgba(0, 0, 0, 0.75) inset`
            }} className="object-cover w-full h-full" data={entry.imgAvatar} />
          </div>
        </div>
        <div className="px-4 w-auto">
          <p className="text-sm font-semibold text-white truncate whitespace-no-wrap min-w-0">{entry.id}</p>
        </div>
      </div>
    </div>
  )
}

const RichText = ({ text, onBlur, onFocus, setText, inputRef, autoFocus, placeholder = '', className, style = {}, suggestionsPortalHost}) => {
  const _getUsers = async (query, callback) => {
    if (!query) return
    const response = await axios.get(`http://localhost:9090/users?id_like=${query}`)
    const userList = response.data.data
    const list = userList.map(user => ({
      display: `@${user.id}`,
      id: user.id,
      imgAvatar: user.imgAvatar,
      username: user.id
    }))
    callback(list)
  }

  const _onChange = (e) => {
    setText(e.target.value)
  }

  const combinedStyle = mergeDeep(defaultStyle, style)

  return (
    <div className={className}>
      <MentionsInput className="outline-none w-full max-w-full"
        style={combinedStyle}
        placeholder={placeholder}
        onChange={e => _onChange(e)}
        value={text}
        allowSuggestionsAboveCursor={true}
        inputRef={inputRef}
        autoFocus={autoFocus}
        suggestionsPortalHost={suggestionsPortalHost}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        <Mention
          trigger='@'
          data={_getUsers}
          appendSpaceOnAdd={true}
          style={{
            backgroundColor: `#df4544`,
            borderRadius: `.1rem`
          }}
          renderSuggestion={RenderUser}
        />
      </MentionsInput>
    </div>
  )
}

export default RichText