const withPWA = require('next-pwa')

module.exports = withPWA({
  pwa: {
    dest: 'public'
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  },
  env: {
    CONTRACT_NAME: 'dev-1592027038343',
    CONTRACT_ENV: 'development',
    BASE_URL: 'https://api-dev.paras.id'
  }
})