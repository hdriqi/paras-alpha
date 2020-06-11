import Image from "components/Image"
import { parseJSON } from "lib/utils"
import ParseBody from "components/parseBody"
import SlideUrl from "components/Slide/Url"

const Page = ({ page }) => {
  if (page.type === 'blank') {
    return (
      <div />
    )
  }
  else if (page.type === 'img') {
    return (
      <Image data={parseJSON(page.body)} />
    )
  }
  else if (page.type === 'text') {
    return (
      <p className="text-white whitespace-pre-line">
        <ParseBody body={parseJSON(page.body)} />
      </p>

    )
  }
  else if (page.type === 'url') {
    return (
      <SlideUrl body={page.body} />
    )
  }
}

export default Page