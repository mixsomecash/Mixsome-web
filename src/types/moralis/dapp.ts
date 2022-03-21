export type MoralisPair = {
  pairAddress: string
  token0: MoralisToken
  token1: MoralisToken
}

export type MoralisToken = {
  address: string
  name: string
  symbol: string
  decimals: string
}
