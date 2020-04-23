import Link from 'next/link'

const ParseBody = ({ body = '' }) => {
  const splitRegex = /(@\[@.+?\]\(.+?\))/
  const captureRegex = /@\[@(.+)?\]\(.+?\)/
  const bodyBlocks = body.split(splitRegex)
  const parsedBlock = bodyBlocks.map((block, idx) => {
    const match = block.match(captureRegex)
    if(match) {
      return (
        <Link key={idx} href="/[username]" as={`/${match[1]}`}>
          <a className="font-semibold text-black-1">@{ match[1] }</a>
        </Link>
      )
    }
    else {
      return (
        <span key={idx}>{block}</span>
      )
    }
  })

  return parsedBlock
}

export default ParseBody