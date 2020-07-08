const withPWA = require('next-pwa')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withPWA({
  pwa: {
    disable: process.env.NODE_ENV === 'development',
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
    CONTRACT_NAME: process.env.CONTRACT_NAME,
    CONTRACT_ENV: 'development',
    BASE_URL: 'https://api-dev.paras.id'
    // BASE_URL: 'http://localhost:9090'
  }
}))