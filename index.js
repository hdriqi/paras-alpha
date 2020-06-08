const axios = require('axios')

axios.post('https://rpc.testnet.near.org', {
  jsonrpc: '2.0',
  id: 'dontcare',
  method: 'query',
  params: {
    request_type: 'view_state',
    finality: 'final',
    account_id: 'paras-dev.testnet',
    prefix_base64: ''
  }
}).then(res => {
  console.log(res.data.result.values)
})

// https://rpc.testnet.near.org jsonrpc=2.0 id=dontcare method=query \
//   params:='{
//     "request_type": "view_state",
//     "finality": "final",
//     "account_id": "test",
//     "prefix_base64": "U1RBVEU="
//   }'