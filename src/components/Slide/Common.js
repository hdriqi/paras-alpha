import SlideImage from "./Image"
import SlideText from "./Text"
import SlideUrl from "./Url"

const SlideCommon = ({ content }) => {
  if (content.type === 'blank') {
    return (
      <div />
    )
  }
  else if (content.type === 'img') {
    return (
      <SlideImage body={content.body} />
    )
  }
  else if (content.type === 'text') {
    return (
      <SlideText body={content.body} />
    )
  }
  else if (content.type === 'url') {
    return (
      <SlideUrl body={content.body} />
    )
  }
}

export default SlideCommon