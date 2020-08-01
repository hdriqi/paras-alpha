import Push from './Push'

const ParseBody = ({ body = '' }) => {
  const splitRegex = /(@\[@.+?\]\(.+?\))/
  const captureRegex = /@\[@(.+)?\]\(.+?\)/
  const trim = body.toString().trim().replace(/(\r\n|\r|\n){2,}/g, '$1\n')
  const bodyBlocks = trim.split(splitRegex)
  const parsedBlock = bodyBlocks.map((block, idx) => {
    const match = block.match(captureRegex)
    if(match) {
      return (
        <Push key={idx} href="/[id]" as={`/${match[1]}`} props={{
          id: match[1]
        }}>
          <a className="bg-primary-5 rounded-sm hover:bg-primary-7">@{ match[1] }</a>
        </Push>
      )
    }
    else {
      return (
        <span className="whitespace-pre-line" key={idx}>{block}</span>
      )
    }
  })

  return parsedBlock
}

export default ParseBody