export type DexToken = {
  address: string
  decimals: number
  logoURI: string
  name: string
  symbol: string
  value?: string
  label?: string
}

export type CurrentTrade = {
  chain: string
  fromTokenAddress: string
  toTokenAddress: string
  amount: string
}

export type Quote = {
  estimatedGas: number
  fromTokenAmount: string
  toTokenAmount: string
  fromToken: DexToken
  toToken: DexToken
}
