import { Currency } from 'constants/currency'
import { ChainId, MoralisToken } from 'types/moralis'

export type PoolInfo = {
  address: string
  chainId: ChainId
  curencies: Array<Currency>
}

export type PoolContractData = {
  token: MoralisToken
  apy: number
  stakedTotal: number
  poolSize: number
  maturityDays: number
  launchTime: number
  closingTime: number
  accountStaked: number | null
  accountStakedTime: number | null
}
