import Image from "components/Image"
import { parseJSON } from "lib/utils"

const SlideImage = ({ body }) => {
  return (
    <div className="w-full relative pb-full">
      <div className="absolute m-auto w-full h-full object-contain">
        <div className="flex items-center h-full">
          <Image data={parseJSON(body)} />
        </div>
      </div>
    </div>
  )
}

export default SlideImage