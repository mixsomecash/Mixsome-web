import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { ChainId } from 'types/moralis'
import { ErrorMessage, Loader } from 'components'
import { getEllipsisText } from 'utils/formatters'
import { getExplorer } from 'utils/networks'
import { getDefiTransactions } from './DefiHelper'
import { DefiTransaction } from './types'

const Defi = () => {
  const { account, chainId } = useMoralis()
  const [defiTransactions, setDefiTransactions] = useState<DefiTransaction[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      if (!account || !chainId) {
        return
      }
      setIsLoading(true)
      const result = await getDefiTransactions(account, chainId as ChainId)
      if (result) {
        setDefiTransactions(result)
      }
      setIsLoading(false)
    })()
  }, [account, chainId])

  const columns = [
    {
      title: 'Contract',
      render: (transaction: DefiTransaction) => getEllipsisText(transaction.contractAddress),
    },
    {
      title: 'Token',
      render: (transaction: DefiTransaction) => getEllipsisText(transaction.token),
    },
    {
      title: 'Function',
      render: (transaction: DefiTransaction) => transaction.function,
    },
    {
      title: 'Amount',
      render: (transaction: DefiTransaction) => transaction.amount,
    },
    {
      title: 'Transaction',
      render: (transaction: DefiTransaction) => (
        <a
          href={`${chainId && getExplorer(chainId)}tx/${transaction.transactionHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-green font-bold"
        >
          View Transaction
        </a>
      ),
    },
  ]

  return (
    <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
      <div className="pb-10 xl:flex items-center">
        <p className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">DeFi</p>
      </div>

      {!isLoading && defiTransactions && defiTransactions.length > 0 && (
        <div className="scrollable-table-wrapper">
          <table className="table-auto w-full xl:mt-4">
            <thead className="border-b border-black border-opacity-20 pb-10">
              <tr>
                {columns.map(column => (
                  <td key={column.title} className="pr-4">
                    <span className="opacity-60 text-14 xl:text-16">{column.title}</span>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {defiTransactions.map(transaction => (
                <tr key={`${transaction.transactionHash}`}>
                  {columns.map(column => (
                    <td key={column.title}>{column.render(transaction)}</td>
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

      {!isLoading && (!defiTransactions || defiTransactions.length === 0) && (
        <ErrorMessage message="No DeFi transactions found" />
      )}
    </div>
  )
}

export default Defi
