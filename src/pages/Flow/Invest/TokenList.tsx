import React from 'react'
import { InvestToken } from './types'

type Props = {
  tokens: InvestToken[]
}

const TokenList = ({ tokens }: Props) => {
  const totalAllocation = tokens.reduce((acc, token) => token.price * token.reserve + acc, 0)
  const columns = [
    {
      title: 'Symbol',
      key: 'symbol',
      render: (item: InvestToken) => item.symbol.toUpperCase(),
    },
    {
      title: 'Name',
      key: 'name',
      render: (item: InvestToken) => item.name,
    },
    {
      title: 'Amount',
      key: 'amount',
      render: (item: InvestToken) => item.reserve.toFixed(4),
    },
    {
      title: 'Price',
      key: 'price',
      render: (item: InvestToken) => `$${item.price.toFixed(4)}`,
    },
    {
      title: 'Allocation',
      key: 'allocation',
      render: (item: InvestToken) => `$${(item.price * item.reserve).toFixed(2)}`,
    },
    {
      title: 'Share',
      key: 'share',
      render: (item: InvestToken) =>
        `${(((item.price * item.reserve) / totalAllocation) * 100).toFixed(2)}%`,
    },
  ]

  return (
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
        {tokens.map(token => (
          <tr key={`${token.symbol}`}>
            {columns.map(column => (
              <td key={column.key}>{column.render(token)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TokenList
