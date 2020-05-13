export const INIT_NEAR = 'INIT_NEAR'
export const initNear = (contract, currentUser, nearConfig, wallet) => {
  return {
    type: INIT_NEAR,
    contract: contract,
    currentUser: currentUser,
    nearConfig: nearConfig,
    wallet: wallet
  }
}