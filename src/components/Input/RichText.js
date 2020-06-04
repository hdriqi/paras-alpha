import { MentionsInput, Mention } from 'react-mentions'
import near from '../../lib/near'
import Image from 'components/Image'

const defaultStyle = {
  control: {
    fontSize: `16px`,
    fontWeight: `400`,
    color: '#616161'
  },
  highlighter: {
    letterSpacing: `-.01rem`
  },
  input: {
    margin: 0,
    padding: `0`,
    color: `white`,
    height: `100%`,
    overflowY: `auto`
  },
  suggestions: {
    marginTop: `1rem`,
    maxHeight: `8rem`,
    overflowY: 'auto',
    width: `100vw`,
    maxWidth: `100%`,
    boxShadow: `0px 0px 4px rgba(0, 0, 0, 0.15)`,
    item: {
      backgroundColor: `#121212`,
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
          <p className="text-sm font-semibold text-white truncate whitespace-no-wrap min-w-0">{entry.username}</p>
        </div>
      </div>
    </div>
  )
}

const RichText = ({ text, setText, inputRef, autoFocus, placeholder = '', className, style}) => {
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
  }

  const _onChange = (e) => {
    setText(e.target.value)
  }

  const combinedStyle = {
    ...defaultStyle,
    ...style
  }

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