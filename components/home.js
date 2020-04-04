const postList = [
  {
    id: '1234',
    block: {
      name: 'Sunda Empire'
    },
    text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    imgList: [
      {
        url: `https://images.pexels.com/photos/3664632/pexels-photo-3664632.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940`
      }
    ],
    author: {
      username: 'ranggasasana',
      avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    }
  },
  {
    id: '1234',
    block: {
      name: 'Sunda Empire'
    },
    text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    imgList: [
      
    ],
    author: {
      username: 'ranggasasana',
      avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    }
  }
]

const Post = ({ data }) => {
  return (
    <div className="mt-6 bg-white shadow-subtle">
      <div className="flex items-center p-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img className="object-cover w-full h-full" src={data.author.avatarUrl} />
        </div>
        <div className="px-4">
          <p className="font-semibold text-black-1">{ data.author.username }</p>
          <p>in <span className="font-semibold text-black-1">{ data.block.name }</span></p>
        </div>
      </div>
      <div>
        <div className="flex flex-no-wrap">
          {
            data.imgList.map(img => {
              return (
                <div className="min-w-full pb-3/4 relative mb-4">
                  <img className="absolute m-auto w-full h-full object-contain" src={img.url} />
                </div>
              )
            })
          }
        </div>
        <div className="px-4 pb-4">
          <p className="text-black-3">{ data.text }</p>
        </div>
      </div>
    </div>
  )
}

const Home = () => {
  return (
    <div className="bg-white-1">
      <div className="pb-16">
        <div className="fixed z-10 top-0 left-0 right-0 bg-white shadow-subtle px-4 py-2">
          <div className="w-full h-full relative">
            <div className="flex ">
              <h1 className="text-3xl font-bold">Feed</h1>
              <h1 className="ml-4 text-3xl font-bold text-black-3">Recent</h1>
            </div>
            <div className="absolute top-0 right-0 py-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10C18 11.8487 17.3729 13.551 16.3199 14.9056L21.7071 20.2929L20.2929 21.7071L14.9056 16.3199C13.551 17.3729 11.8487 18 10 18ZM16 10C16 13.3137 13.3137 16 10 16C6.68629 16 4 13.3137 4 10C4 6.68629 6.68629 4 10 4C13.3137 4 16 6.68629 16 10Z" fill="black"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {
        postList.map(post => {
          return (
           <Post key={post.id} data={post} /> 
          )
        })
      }
    </div>
  )
}

export default Home