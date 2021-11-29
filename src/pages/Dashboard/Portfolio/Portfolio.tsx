import React, { FormEvent, useState, useEffect, useMemo } from 'react'
import { useMoralis, useERC20Balances, useNativeBalance } from 'react-moralis'
import { ErrorMessage, Loader } from 'components'
import { useCoinGecko } from 'hooks'
import {
  nativeTokenBalanceToGenericBalance as nativeBalanceToGenericBalance,
  GenericTokenBalance,
  tokenBalancesToGenericBalances,
} from './PortfolioHelper'

const Portfolio = () => {
  const { data: nativeTokenBalance, nativeToken, isLoading: isLoadingNative } = useNativeBalance()
  const { data: tokenBalances, isLoading: isLoadingTokens } = useERC20Balances()
  const { Moralis, isAuthenticated } = useMoralis()
  const { coins } = useCoinGecko()

  const [searchTerm, setSearchTerm] = useState<string>('')
  const [allTokenBalances, setAllTokenBalances] = useState<GenericTokenBalance[] | null>(null)

  const isLoading = isLoadingNative || isLoadingTokens

  useEffect(() => {
    if (!tokenBalances || !nativeToken || !nativeTokenBalance?.balance || !coins) {
      return
    }

    const genericNativeBalance = nativeBalanceToGenericBalance(
      nativeToken,
      nativeTokenBalance?.balance,
      coins,
    )
    const genericTokenBalances = tokenBalancesToGenericBalances(tokenBalances, coins)

    if (!genericNativeBalance || !genericTokenBalances) {
      return
    }

    setAllTokenBalances([genericNativeBalance, ...genericTokenBalances])
  }, [tokenBalances, nativeToken, nativeTokenBalance?.balance, coins])

  if (!isAuthenticated) {
    return <ErrorMessage message="Please connect to your wallet" />
  }

  const handleSearchChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearchTerm(value)
  }

  const getFilteredBalances = () => {
    if (!allTokenBalances) {
      return null
    }

    return allTokenBalances.filter(
      balance =>
        balance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        balance.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const columns = [
    {
      title: '',
      key: 'image',
      render: (item: GenericTokenBalance) => (
        <img
          src={item.image || 'https://etherscan.io/images/main/empty-token.png'}
          alt="nologo"
          width="28px"
          height="28px"
        />
      ),
    },
    {
      title: 'Name',
      key: 'name',
      render: (item: GenericTokenBalance) => item.name,
    },
    {
      title: 'Symbol',
      key: 'symbol',
      render: (item: GenericTokenBalance) => item.symbol,
    },
    {
      title: 'Price',
      key: 'price',
      render: (item: GenericTokenBalance) => item.price,
    },
    {
      title: 'Balance',
      key: 'balance',
      render: (item: GenericTokenBalance) =>
        parseFloat(Moralis.Units.FromWei(item.balance, item.decimals).toFixed(6)),
    },
  ]

  const filteredBalances = getFilteredBalances()

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

      {!isLoading && filteredBalances && filteredBalances.length > 0 && (
        <div className="scrollable-table-wrapper">
          <table className="table-auto w-full xl:mt-4">
            <thead className="border-b border-black border-opacity-20 pb-10">
              <tr>
                {columns.map(column => (
                  <td key={column.key} className="pr-4">
                    <span className="opacity-60 text-14 xl:text-16">{column.title}</span>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBalances.map(balance => (
                <tr key={`${balance.symbol}`}>
                  {columns.map(column => (
                    <td key={column.key}>{column.render(balance)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <Loader />
        </div>
      )}

      {!isLoading && (!filteredBalances || filteredBalances.length === 0) && (
        <ErrorMessage message="No tokens found" />
      )}
    </div>
  )
}

export default Portfolio
