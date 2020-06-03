import ParseBody from '../parseBody'

const SlideText = ({ body }) => {
  return (
    <div className="w-full relative pb-full">
      <div className="absolute m-auto w-full h-full overflow-y-auto">
        <div className="flex h-full px-2">
          <p className="mt-auto mb-auto text-left text-white whitespace-pre-line">
            <ParseBody body={body} />
          </p>
        </div>
      </div>
    </div>
  )
}

export default SlideText