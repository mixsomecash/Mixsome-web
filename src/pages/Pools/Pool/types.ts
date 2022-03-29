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
  stakedTotal: string
  poolSize: string
  maturityDays: number
  launchTime: number
  closingTime: number
  accountStaked: string | null
  accountStakedTime: number | null
}
