import React, { useContext } from 'react'
import { useERC20Transfers, useMoralis } from 'react-moralis'
import { AppContext } from 'AppContext'
import { MoralisERC20Transfer } from 'types/moralis'
import { getEllipsisText } from 'utils/formatters'
import { getExplorer } from 'utils/networks'

const History = () => {
  const { account } = useContext(AppContext)
  const { Moralis, chainId } = useMoralis()
  const { data } = useERC20Transfers({ address: account?.address })

  if (!data) {
    return null
  }

  const transfersData = (data as any).result as MoralisERC20Transfer[]

  const columns = [
    {
      title: 'Token',
      key: 'address',
      render: (token: string) => getEllipsisText(token, 8),
    },
    {
      title: 'From',
      key: 'from_address',
      render: (from: string) => getEllipsisText(from, 8),
    },
    {
      title: 'To',
      key: 'to_address',
      render: (to: string) => getEllipsisText(to, 8),
    },
    {
      title: 'Value',
      key: 'value',
      render: (value, item) => parseFloat(Moralis.Units.FromWei(value, item.decimals).toFixed(6)),
    },
    {
      title: 'Hash',
      key: 'transaction_hash',
      render: (hash: string) => (
        <a href={`${chainId && getExplorer(chainId)}tx/${hash}`} target="_blank" rel="noreferrer">
          View Transaction
        </a>
      ),
    },
  ]

  const renderTableHeader = () => {
    return (
      <thead className="border-b border-black border-opacity-20 pb-10">
        <tr>
          {columns.map(column => (
            <td key={column.key} className="pr-4">
              <span className="opacity-60 text-14 xl:text-16">{column.title}</span>
            </td>
          ))}
        </tr>
      </thead>
    )
  }

  return (
    <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
      <div className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">
        History
      </div>
      <table className="table-auto w-full xl:mt-10">
        {renderTableHeader()}
        <tbody>
          {transfersData?.map(transfer => (
            <tr key={transfer.transaction_hash}>
              {columns.map(column => (
                <td key={column.key}>{column.render(transfer[column.key], transfer)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default History
