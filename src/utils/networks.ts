export const networkConfigs = {
  '0x1': {
    chainId: 1,
    chainName: 'Ethereum Mainnet',
    currencyName: 'ETH',
    currencySymbol: 'ETH',
    blockExplorerUrl: 'https://etherscan.io/',
    wrapped: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    coinGeckoId: 'ethereum',
    decimals: 18,
  },
  '0x38': {
    chainId: 56,
    chainName: 'Smart Chain',
    currencyName: 'BNB',
    currencySymbol: 'BNB',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    blockExplorerUrl: 'https://bscscan.com/',
    wrapped: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    coinGeckoId: 'binancecoin',
    decimals: 18,
  },
}

export const getExplorer = (chain: string) => networkConfigs[chain]?.blockExplorerUrl
