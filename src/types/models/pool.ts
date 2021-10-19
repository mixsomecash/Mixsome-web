import { Currency } from 'constants/currency'

export type PoolModel = {
  address: string
  crypto: string
  curencies: Array<Currency>
  deposit: string
  apy: string
  totalLiquidity: string
  network: string
  status: string
}
