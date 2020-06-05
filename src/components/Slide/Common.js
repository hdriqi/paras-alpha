import SlideImage from "./Image"
import SlideText from "./Text"
import SlideUrl from "./Url"

const SlideCommon = ({ page }) => {
  if (page.type === 'blank') {
    return (
      <div />
    )
  }
  else if (page.type === 'img') {
    return (
      <SlideImage body={page.body} />
    )
  }
  else if (page.type === 'text') {
    return (
      <SlideText body={page.body} />
    )
  }
  else if (page.type === 'url') {
    return (
      <SlideUrl body={page.body} />
    )
  }
}

export default SlideCommon