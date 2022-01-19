export type Erc20Token = {
  balance: string | undefined
  decimals: number
  logo?: string | null
  name: string
  symbol: string
  thumbnail?: string | null
  token_address: string
}

export type Transaction = {
  amount: string | number
  receiver: string | undefined
  asset: Erc20Token
}
