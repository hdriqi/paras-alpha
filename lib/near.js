import getConfig from './config.js';
import * as nearAPI from 'near-api-js';

// Initializing contract
export const initContract = async () => {
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
    viewMethods: ['getMessages'],
    // Change methods can modify the state, but you don't receive the returned value when called
    changeMethods: ['addMessage'],
    // Sender is the account ID to initialize transactions.
    // getAccountId() will return empty string if user is still unauthorized
    sender: wallet.getAccountId()
  })

  return { contract, currentUser, nearConfig, wallet }
}

// window.nearInitPromise = initContract().then(() => {
//   ReactDOM.render(<App contract={window.contract} wallet={window.walletAccount} />,
//     document.getElementById('root')
//   );
// }).catch(console.error)

// export default initContract()