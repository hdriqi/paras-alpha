import NewPostText from './Text'
import NewPostImage from './Image'
import NewPostUrl from './Url'

const NewPostModal = ({ type, left, right, input }) => {
  switch (type) {
    case 'text':
      return <NewPostText
        left={left}
        right={right}
        input={input}
      />
    case 'img':
      return <NewPostImage
        left={left}
        right={right}
        input={input}
      />
    case 'url':
      return <NewPostUrl
        left={left}
        right={right}
        input={input}
      />
    default:
      return <div />
  }
}

export default NewPostModal