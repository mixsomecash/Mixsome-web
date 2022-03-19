export const config = {
  isProduction: process.env.REACT_APP_PRODUCTION === 'true' || false,
  etherscanUrl: process.env.REACT_APP_ETHERSCAN_ADDRESS,
  etherscanApiKey: process.env.REACT_APP_ETHERSCAN_API_KEY,
  moralis: {
    appId: process.env.REACT_APP_MORALIS_APP_ID,
    serverUrl: process.env.REACT_APP_MORALIS_SERVER_URL,
  },
  coingecko: {
    url: process.env.REACT_APP_COINGECKO_API_URL,
  },
}
