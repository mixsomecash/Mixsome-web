import { Currency } from 'constants/currency'
import { ChainId } from 'types/moralis'

export type PoolInfo = {
  address: string
  chainId: ChainId
  decimals: number
  deposit: string
  crypto: string
  curencies: Array<Currency>
  apy: string
}

export type PoolContractData = {
  stakedTotal: number
  poolSize: number
  maturityDays: number
  launchTime: number
  closingTime: number
  accountStaked: number
}
