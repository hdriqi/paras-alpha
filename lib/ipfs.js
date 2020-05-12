import ipfsClient from 'ipfs-http-client'

class IPFS {
  constructor() {
    this.client = null
  }

  init() {
    this.client = ipfsClient({ host: 'ipfs-api.paras.id', port: '443', protocol: 'https' })
  }
}

export default new IPFS()