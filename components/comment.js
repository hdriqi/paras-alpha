import Link from "next/link"

// {
//   id: '1234',
//   block: {
//     name: 'Sunda Empire'
//   },
//   text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
//   imgList: [
//     {
//       url: `https://images.pexels.com/photos/3664632/pexels-photo-3664632.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
//     },
//     {
//       url: `https://images.pexels.com/photos/3467149/pexels-photo-3467149.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
//     }
//   ],
//   author: {
//     username: 'ranggasasana',
//     avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
//   },
//   createdAt: '2020-04-04T10:14:42.399Z'
// },

const Comment = ({ comment }) => {
  if(!comment.id) {
    return (
      <div>
        Loading
      </div>
    )
  }
  else {
    const splitRegex = /(@\[@.+?\]\(.+?\))/
    const captureRegex = /@\[@(.+)?\]\(.+?\)/
    const bodyBlocks = comment.bodyRaw.split(splitRegex)
    const parsedBlock = bodyBlocks.map(block => {
      const match = block.match(captureRegex)
      if(match) {
        return (
          <Link href="/[username]" as={`/${match[1]}`}>
            <a className="font-semibold text-black-1">@{ match[1] }</a>
          </Link>
        )
      }
      else {
        return block
      }
    })
    return (
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img className="object-cover w-full h-full" src={comment.user.avatarUrl} />
        </div>
        <div className="px-4">
          <p className="font-semibold text-black-1">{ comment.user.username }</p>
          <p className="text-black-3">{ parsedBlock }</p>
        </div>
      </div>
    )
  }
}

export default Comment