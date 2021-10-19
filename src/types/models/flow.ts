import { Currency } from 'constants/currency'

export type FlowModel = {
  id: number
  name: string
  optimal?: boolean
  availableCurrencies: Array<Currency>
  apyPtc: number
  liquidity: string
}
