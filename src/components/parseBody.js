import Push from './Push'

const ParseBody = ({ body = '' }) => {
  const splitRegex = /(@\[@.+?\]\(.+?\))/
  const captureRegex = /@\[@(.+)?\]\(.+?\)/
  const bodyBlocks = body.split(splitRegex)
  const parsedBlock = bodyBlocks.map((block, idx) => {
    const match = block.match(captureRegex)
    if(match) {
      return (
        <Push key={idx} href="/[username]" as={`/${match[1]}`} props={{
          username: match[1]
        }}>
          <a className="font-semibold text-black-1">@{ match[1] }</a>
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