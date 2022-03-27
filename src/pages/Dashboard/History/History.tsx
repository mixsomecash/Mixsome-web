import React, { useEffect, useState } from 'react'
import { useERC20Transfers, useNFTTransfers, useMoralis } from 'react-moralis'
import { ErrorMessage, Loader } from 'components'
import { getEllipsisText } from 'utils/formatters'
import { getExplorer } from 'utils/networks'
import { ChainId } from 'types/moralis'
import {
  GenericTransfer,
  erc20ToGenericTransfer,
  nftToGenericTransfer,
  getSymbolsByAddresses,
} from './HistoryHelper'

const History = () => {
  const { Moralis, chainId, account, isAuthenticated } = useMoralis()
  const { data: erc20Data, isLoading: isLoadingERC20 } = useERC20Transfers({
    address: account ?? '',
  })
  const { data: nftData, isLoading: isLoadingNFT } = useNFTTransfers({ address: account ?? '' })
  const [allTransfers, setAllTransfers] = useState<GenericTransfer[] | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!erc20Data?.result || !nftData || !chainId) {
        return
      }

      const tokenAddresses = Array.from(new Set(erc20Data.result.map(data => data.address)))
      const tokenSymbols = await getSymbolsByAddresses(tokenAddresses, chainId as ChainId)

      const erc20Transfers = erc20Data.result.map(data =>
        erc20ToGenericTransfer(data, tokenSymbols),
      )
      const nftTransfers = nftData.result.map(nftToGenericTransfer)
      const combinedTransfers = [...erc20Transfers, ...nftTransfers].sort(
        (a, b) => new Date(b.blockTimestamp).getTime() - new Date(a.blockTimestamp).getTime(),
      )
      setAllTransfers(combinedTransfers)
    })()
  }, [erc20Data, nftData, chainId])

  if (!isAuthenticated || !account || !chainId) {
    return <ErrorMessage message="Please connect to your wallet" />
  }

  const isLoading = isLoadingERC20 || isLoadingNFT

  const columns = [
    {
      title: 'Symbol',
      key: 'symbol',
      render: (item: string) => item.toUpperCase(),
    },
    {
      title: 'IN/OUT',
      key: 'toAddress',
      render: (to: string) =>
        to === account ? (
          <div className="text-green font-bold">IN</div>
        ) : (
          <div className="text-green font-bold">OUT</div>
        ),
    },
    {
      title: 'From',
      key: 'fromAddress',
      render: (from: string) => getEllipsisText(from, 8),
    },
    {
      title: 'To',
      key: 'toAddress',
      render: (to: string) => getEllipsisText(to, 8),
    },
    {
      title: 'Value',
      key: 'value',
      render: (value, item) => parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: 'Transaction',
      key: 'transactionHash',
      render: (hash: string) => (
        <a
          href={`${chainId && getExplorer(chainId)}tx/${hash}`}
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
      <div className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">
        History
      </div>

      {!isLoading &&
        allTransfers &&
        (allTransfers.length > 0 ? (
          <table className="table-auto w-full xl:mt-10">
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
              {allTransfers.map(transfer => (
                <tr key={`${transfer.type}-${transfer.transactionHash}`}>
                  {columns.map(column => (
                    <td key={column.key}>{column.render(transfer[column.key], transfer)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center opacity-60 mt-3">No History</div>
        ))}

      {isLoading && (
        <div className="text-center">
          <Loader />
        </div>
      )}

      {!isLoading && !allTransfers && (
        <ErrorMessage message="An error occurred while getting transfers" />
      )}
    </div>
  )
}

export default History
