import { ADD_BLOCK_LIST, ADD_POST_LIST } from '../actions/me'

const initialState = {
  blockList: [
    
  ],
  postList: [
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
    // {
    //   id: '1235',
    //   block: {
    //     name: 'Sunda Empire'
    //   },
    //   text: 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source.',
    //   imgList: [
        
    //   ],
    //   author: {
    //     username: 'ranggasasana',
    //     avatarUrl: 'https://images.pexels.com/photos/3862601/pexels-photo-3862601.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    //   },
    //   createdAt: '2020-04-04T10:14:42.399Z'
    // }
  ]
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_BLOCK_LIST:
      return {
        ...state,
        blockList: state.blockList.concat(action.blockList)
      }
    case ADD_POST_LIST:
      return {
        ...state,
        postList: state.postList.concat(action.postList)
      }
    default:
      return state
  }
}

export default reducer