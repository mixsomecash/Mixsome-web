import { ChainId } from 'types/moralis'

export type TokenMetadata = {
  address: string
  name: string
  symbol: string
  decimals: string
  logo?: string
  logo_hash?: string
  thumbnail?: string
  block_number?: string
  validated?: string
}

export type MetaMaskError = {
  code: number
  message: string
}

export type ApprovalTransactions = {
  transactionHash: string
  contractAddress: string
  timestamp: string
  allowance: string
  spenderAddress: string
  metadata: TokenMetadata | null
}

export type AllowanceDto = {
  chainId: ChainId
  ownerAddress: string
  spenderAddress: string
  contractAddress: string
}
