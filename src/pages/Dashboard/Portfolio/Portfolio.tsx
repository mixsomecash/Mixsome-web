import React, { FormEvent, useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { ErrorMessage, Loader } from 'components'
import { ChainId } from 'types/moralis'
import { GenericTokenBalance, getTokenBalances, getUsdBalance } from './PortfolioHelper'

type Props = {
  onNetWorthChange?: (netWorth: number | string) => void
}

const Portfolio = ({ onNetWorthChange }: Props) => {
  const { Moralis, isAuthenticated, account, chainId } = useMoralis()

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [tokenBalances, setTokenBalances] = useState<GenericTokenBalance[] | null>(null)

  useEffect(() => {
    if (!account || !chainId) {
      return
    }
    ;(async () => {
      setErrorMessage(null)
      setIsLoading(true)
      const balances = await getTokenBalances(account, chainId as ChainId)
      if (balances) {
        setTokenBalances(balances)
        if (onNetWorthChange) {
          const netWorth = balances
            .reduce((acc, tokenBalance) => getUsdBalance(tokenBalance) + acc, 0)
            .toFixed(2)
          onNetWorthChange(netWorth)
        }
      } else {
        setErrorMessage('An error occurred while getting balances')
      }
      setIsLoading(false)
    })()
  }, [account, chainId, onNetWorthChange])

  if (!isAuthenticated || !account || !chainId) {
    return <ErrorMessage message="Please connect to your wallet" />
  }

  const handleSearchChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget
    setSearchTerm(value)
  }

  const getFilteredBalances = () => {
    if (!tokenBalances) {
      return null
    }

    return tokenBalances.filter(
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
      render: (item: GenericTokenBalance) => item.symbol.toUpperCase(),
    },
    {
      title: 'Price',
      key: 'price',
      render: (item: GenericTokenBalance) => `$${item.price.toFixed(4)}`,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (item: GenericTokenBalance) =>
        Moralis.Units.FromWei(item.amount, item.decimals).toFixed(4),
    },
    {
      title: 'Balance',
      key: 'balance',
      render: (item: GenericTokenBalance) => `$${getUsdBalance(item).toFixed(2)}`,
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

      {!isLoading && !errorMessage && filteredBalances && filteredBalances.length > 0 && (
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

      {!isLoading && !errorMessage && (!filteredBalances || filteredBalances.length === 0) && (
        <ErrorMessage message="No tokens found" />
      )}

      {errorMessage && <ErrorMessage message={errorMessage} />}
    </div>
  )
}

export default Portfolio
