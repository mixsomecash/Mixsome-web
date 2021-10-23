import React, { FormEvent, useEffect, useMemo, useState } from 'react'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'

import { Button, Loader } from 'components'
import { getCoinData } from 'data/coingecko'
import { tokenValue } from 'utils/token'

import { DashboardNetwork } from '../types'

type Coin = {
  imageUrl: string
  name: string
  symbol: string
  price: number
  balance: number
}

type Props = {
  networkId: DashboardNetwork
}

const Portfolio = ({ networkId }: Props) => {
  const { user, isAuthenticated } = useMoralis()
  const [coins, setCoins] = useState<Array<Coin>>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [isLoading, setIsloading] = useState(true)

  const userAddress = useMemo(() => user?.attributes.ethAddress, [user])
  const { data: tokensData, isLoading: isTokensLoading } = useMoralisCloudFunction('getTokens', {
    userAddress,
  })

  useEffect(() => {
    const fetchData = async () => {
      setIsloading(true)

      const tokenNames = tokensData.map(token => token.name.replace(/ .*/, '').toLowerCase())

      const response = await getCoinData(tokenNames)

      if (!response?.data) return

      const mergedCoinData = response.data.map(coin => {
        const data = tokensData.filter(
          tokenData => tokenData.name.replace(/ .*/, '').toLowerCase() === coin.name.toLowerCase(),
        )[0]

        if (!data) return null

        return {
          imageUrl: coin.image,
          name: coin.name,
          symbol: coin.symbol,
          price: coin.current_price,
          balance: tokenValue(data.balance, data.decimals) || 0,
        }
      })

      setCoins(mergedCoinData)

      setIsloading(false)
    }

    if (isTokensLoading || !tokensData.length) return

    fetchData()
  }, [isTokensLoading, tokensData, networkId])

  const handleSearchChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    setSearchTerm(value)
  }

  const renderCoin = (coin: Coin, index: number) => {
    return (
      <tr key={index}>
        <td className="sticky-col">
          <div className="flex items-center text-left">
            <div className="w-1/4">
              <div className="w-8 h-8 lg:w-10 lg:h-10">
                <img className="w-full h-full" src={coin.imageUrl} alt="" />
              </div>
            </div>
            <div className="w-2/4 px-3 text-14 xl:text-16">{coin.name}</div>
            <div className="w-1/4 mr-5">
              <span className="opacity-40 text-14 xl:text-16 mx-2">
                {coin.symbol.toUpperCase()}
              </span>
            </div>
          </div>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">$ {coin.price.toFixed(2)}</span>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">{coin.balance}</span>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">-</span>
        </td>
        <td>
          <span className="font-mono text-14 xl:text-16">
            $ {(coin.price * coin.balance).toFixed(2)}
          </span>
        </td>
        <td>
          <div className="flex justify-center">
            <Button
              text="Sell"
              invert
              disabled
              onClick={() => {
                return null
              }}
            />
            <div className="ml-2" />
            <Button
              text="Buy"
              disabled
              onClick={() => {
                return null
              }}
            />
          </div>
        </td>
      </tr>
    )
  }

  const renderNoSearchResults = () => {
    return (
      <tr className="w-full text-center">
        <td colSpan={6}>
          {isLoading && <Loader />}
          {!isLoading && (
            <span className="opacity-60">Sorry but tokens by search text not found :(</span>
          )}
        </td>
      </tr>
    )
  }

  const renderCoins = () => {
    const filteredCoins = coins.filter(coin => {
      return (
        coin?.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
        coin?.symbol.toLowerCase().includes(searchTerm?.toLowerCase())
      )
    })

    if (!filteredCoins.length) return renderNoSearchResults()

    return filteredCoins.map(renderCoin)
  }

  if (!isAuthenticated)
    return (
      <div className="text-center">
        <span className="text-18 opacity-60">Please connect to your wallet...</span>
      </div>
    )

  return (
    <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
      <div className="pb-10 xl:flex items-center">
        <p className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">
          My Balance
        </p>
        <input
          type="text"
          placeholder="Search by token name or symbol"
          className="border ml-auto p-4 w-full xl:w-1/3 lg:w-1/3 border-opacity-20 text-15"
          onChange={handleSearchChange}
        />
      </div>

      <div className="scrollable-table-wrapper">
        <table className="table-auto w-full xl:mt-10">
          <thead className="border-b border-black border-opacity-20 pb-10">
            <tr>
              <td className="sticky-col pr-4">
                <span className="opacity-60 text-14 xl:text-16">Token</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Price</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Balance</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Liquidity</span>
              </td>
              <td className="pr-4">
                <span className="opacity-60 text-14 xl:text-16">Total Balance</span>
              </td>
              <td className="text-center">
                <span className="opacity-60 text-14 xl:text-16">Action</span>
              </td>
            </tr>
          </thead>
          <tbody>{renderCoins()}</tbody>
        </table>
      </div>
    </div>
  )
}

export default Portfolio
