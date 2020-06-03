const SlideImage = ({ body }) => {
  return (
    <div className="w-full relative pb-full">
      <div className="absolute m-auto w-full h-full object-contain">
        <div className="flex items-center h-full">
          <img src={body} />
        </div>
      </div>
    </div>
  )
}

export default SlideImage