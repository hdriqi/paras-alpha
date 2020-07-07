import getConfig from '../config'
import * as nearAPI from 'near-api-js'
import { Base64 } from 'js-base64'

class Near {
  constructor() {
    this.contract = {}
    this.currentUser = null
    this.config = {}
    this.wallet = {}
    this.signer = {}
  }

  async authToken() {
    const userId = near.currentUser.accountId
    const arr = new Array(userId)
    for (var i = 0; i < userId.length; i++) {
      arr[i] = userId.charCodeAt(i)
    }
    const msgBuf = new Uint8Array(arr)
    const signedMsg = await this.signer.signMessage(msgBuf, this.wallet._authData.accountId, this.wallet._networkId)
    const pubKey = Buffer.from(signedMsg.publicKey.data).toString('hex')
    const signature = Buffer.from(signedMsg.signature).toString('hex')
    const payload = [userId, pubKey, signature]
    return Base64.encode(payload.join('&'))
  }

  async signMessage(msg) {
    const arr = new Array(msg.length)
    for (var i = 0; i < msg.length; i++) {
      arr[i] = msg.charCodeAt(i)
    }
    const msgBuf = new Uint8Array(arr)
    const signedMsg = await this.signer.signMessage(msgBuf, this.wallet._authData.accountId, this.wallet._networkId)
    return {
      pubKey: Buffer.from(signedMsg.publicKey.data).toString('hex'),
      signature: Buffer.from(signedMsg.signature).toString('hex')
    }
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
        'getUserById',
        'getMementoById',
        'name',
        'symbol',
        'decimals',
        'balanceOf',
        'allowance',
        'getBalance'
      ],
      // Change methods can modify the state, but you don't receive the returned value when called
      changeMethods: [
        'createMemento',
        'updateMemento',
        'archiveMemento',
        'unarchiveMemento',
        'deleteMemento',
        'createPost',
        'transmitPost',
        'editPost',
        'deletePost',
        'redactPost',
        'toggleFollow',
        'createUser',
        'updateUser',
        'createComment',
        'deleteComment',
        'init',
        'transfer',
        'approve',
        'transferFrom',
        'piecePost'
      ],
      // Sender is the account ID to initialize transactions.
      // getAccountId() will return empty string if user is still unauthorized
      sender: wallet.getAccountId(),
    })

    // const response = await contract.init({
    //   initialOwner: 'riqi.testnet'
    // })
    // console.log(response)

    this.contract = contract
    this.currentUser = currentUser
    this.config = nearConfig
    this.wallet = wallet
    this.signer = new nearAPI.InMemorySigner(wallet._keyStore)
  }
}

const near = new Near()

export default near