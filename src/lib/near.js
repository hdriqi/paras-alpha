import getConfig from '../config';
import * as nearAPI from 'near-api-js';

class Near {
  constructor() {
    this.contract = {}
    this.currentUser = null
    this.config = {}
    this.wallet = {}
  }

  async init() {
    const nearConfig = getConfig(process.env.NODE_ENV || 'development')

    // Initializing connection to the NEAR DevNet
    const near = await nearAPI.connect({
      deps: {
        keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore()
      },
      ...nearConfig
    })
  
    // Needed to access wallet
    const wallet = new nearAPI.WalletConnection(near)
  
    // Load in account data
    let currentUser
    if (wallet.getAccountId()) {
      currentUser = {
        accountId: wallet.getAccountId(),
        balance: (await wallet.account().state()).amount
      }
    }
  
    // Initializing our contract APIs by contract name and configuration
    const contract = await new nearAPI.Contract(wallet.account(), nearConfig.contractName, {
      // View methods are read-only – they don't modify the state, but usually return some value
      viewMethods: [
        'getUserById'
      ],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: [
        'createMemento',
        'updateMemento',
        'createPost', 
        'deletePost',
        'deleteMementoById',
        'transmitPost',
        'deletePostById',
        'createUser',
        'updateUserById',
        'toggleUserFollow',
        'createComment',
        'deleteCommentById'
      ],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: wallet.getAccountId()
    })
  
    this.contract = contract
    this.currentUser = currentUser
    this.config = nearConfig
    this.wallet = wallet
  }
}

const near = new Near()

export default near