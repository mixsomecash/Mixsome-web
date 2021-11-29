import { useState, useEffect } from 'react'
import axios from 'axios'
import { config } from 'config'

export type CoinGeckoCoin = {
  id: string
  symbol: string
  name: string
  current_price: number
  image: string
}

const useCoinGecko = () => {
  const [coins, setCoins] = useState<CoinGeckoCoin[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      try {
        const response = await axios.get(`${config.coingecko.url}/coins/markets?vs_currency=usd`)
        setCoins(response.data)
        setIsLoading(false)
      } catch (ex) {
        setIsLoading(false)
      }
    })()
  }, [])

  return { coins, isLoading }
}

export default useCoinGecko
