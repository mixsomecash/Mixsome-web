import axios from 'axios'
import { config } from '../config'

export type CoinGeckoCoin = {
  id: string
  symbol: string
  name: string
}

export type CoinGeckoMarketCoin = {
  id: string
  symbol: string
  name: string
  current_price: number
  image: string
}

export const getCoinsList = async (): Promise<CoinGeckoCoin[] | null> => {
  const response = await axios.get(`${config.coingecko.url}/coins/list`).catch(() => null)
  return response?.data
}

export const getCoinsMarkets = async (ids: string[]): Promise<CoinGeckoMarketCoin[] | null> => {
  const response = await axios
    .get(`${config.coingecko.url}/coins/markets?vs_currency=usd&ids=${ids.join(',')}`)
    .catch(() => null)
  return response?.data
}
