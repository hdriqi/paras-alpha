import Image from "components/Image"

const { default: ParseBody } = require("components/parseBody")

const ItemPostList = ({ page }) => {
  if (page.type === 'blank') {
    return (
      <div />
    )
  }
  else if (page.type === 'img') {
    return (
      <div className="w-full relative pb-full cursor-default">
        <div className="absolute m-auto w-full h-full object-contain flex items-center">
          <Image data={JSON.parse(page.body)} />
        </div>
      </div>
    )
  }
  else if (page.type === 'text') {
    return (
      <div className="w-full relative pb-full cursor-default">
        <div className="absolute m-auto w-full h-full object-contain p-2 overflow-hidden">
          <p className="text-white text-sm"><ParseBody body={page.body}/></p>
        </div>
      </div>
    )
  }
  else if (page.type === 'url') {
    const data = JSON.parse(page.body)
    return (
      <div className="w-full relative pb-full cursor-default">
        <div className="absolute m-auto w-full h-full object-contain flex items-center">
          <Image data={data.img} />
        </div>
      </div>
    )
  }
}

const Item = ({ data }) => {
  return (
    <div className="cursor-pointer">
      <div className="flex items-center bg-dark-2 p-2">
        <div className="h-6 w-6 rounded-full overflow-hidden shadow-inner">
          <Image className="object-fill" data={data.img} />
        </div>
        <div className="ml-2">
          <h4 className="text-white font-bold">{data.id}</h4>
        </div>
      </div>
      <div className="flex">
        {
          data.postList.map(post => {
            return (
              <div className="w-1/3 bg-dark-2">
                <ItemPostList page={post.contentList[0]} />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Item