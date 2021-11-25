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
  amount: number
}
