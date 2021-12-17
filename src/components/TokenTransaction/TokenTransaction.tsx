import React, { useState } from 'react'
import { MoralisPair } from 'types/moralis'
import { Tabs } from 'components'
import TransactionForm from './TransactionForm'
import { TokenTransactionTab } from './types'

type Props = {
  pair: MoralisPair
}

const TokenTransaction = ({ pair }: Props) => {
  const tabs = [
    {
      id: TokenTransactionTab.Buy,
      title: 'Buy',
    },
    {
      id: TokenTransactionTab.Sell,
      title: 'Sell',
    },
  ]

  const [activeTabId, setActiveTabId] = useState(TokenTransactionTab.Buy)

  const handleTabClick = (id: TokenTransactionTab) => setActiveTabId(id)

  const renderTabContent = () => {
    switch (activeTabId) {
      case TokenTransactionTab.Buy:
        return <TransactionForm token0={pair.token1} token1={pair.token0} />
      case TokenTransactionTab.Sell:
        return <TransactionForm token0={pair.token0} token1={pair.token1} isSell />
      default:
        return null
    }
  }

  return (
    <div>
      <Tabs activeTabId={activeTabId} items={tabs} onClick={handleTabClick} />
      <div className="my-10">{renderTabContent()}</div>
    </div>
  )
}

export default TokenTransaction
