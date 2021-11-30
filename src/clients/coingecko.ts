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
  try {
    const response = await axios.get(`${config.coingecko.url}/coins/list`)
    return response.data
  } catch (ex) {
    return null
  }
}

export const getCoinsMarkets = async (ids: string[]): Promise<CoinGeckoMarketCoin[] | null> => {
  try {
    const response = await axios.get(
      `${config.coingecko.url}/coins/markets?vs_currency=usd&ids=${ids.join(',')}`,
    )
    return response.data
  } catch (ex) {
    return null
  }
}
