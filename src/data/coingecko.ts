import axios from 'axios'

import { config } from '../config'

export const getCoinData = async (ids: Array<string>) => {
  try {
    const response = await axios.get(`${config.coingecko.url}?vs_currency=usd&ids=${ids.join(',')}`)

    return response
  } catch (ex) {
    return null
  }
}
