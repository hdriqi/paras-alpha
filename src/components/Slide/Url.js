import Image from "components/Image"
import { parseJSON } from "lib/utils"

const SlideUrl = ({ body }) => {
  const parsed = parseJSON(body)
  return (
    <div className="w-full relative pb-full">
      <div className="absolute m-auto w-full h-full p-2">
        <a href={parsed.url} target="_blank">
          <div className="bg-dark-12 rounded-md overflow-hidden h-full hover:opacity-75">
            <div className="relative bg-white" style={{
              height: `60%`
            }}>
              <Image className="h-full w-full object-cover" data={parsed.img} />
              <div className="absolute inset-0 flex items-center justify-center" style={{
                background: `rgba(0,0,0,0.4)`
              }}>
                <p className="text-white font-bold text-2xl text-center px-2">{parsed.title}</p>
              </div>
            </div>
            <div className="p-2" style={{
              height: `30%`
            }}>
              <div className="h-full overflow-hidden" style={{
                maxHeight: `72px`
              }}>
                <p className="text-white opacity-60">{parsed.desc}</p>
              </div>
            </div>
            <div className="px-2 pb-2" style={{
              height: `10%`
            }}>
              <p className="text-white font-medium opacity-87 truncate">{parsed.url}</p>
            </div>
          </div>
        </a>
      </div>
    </div>
  )
}

export default SlideUrl