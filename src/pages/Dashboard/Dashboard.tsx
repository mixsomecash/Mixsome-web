import React, { useState } from 'react'

import { Tabs, ToggleButton } from 'components'

import Portfolio from './Portfolio'
import NFTs from './NFTs'
import History from './History'
import Defi from './Defi'
import Transfer from './Transfer'

import { DashboardTab, DashboardNetwork } from './types'

const tabs = [
  {
    id: DashboardTab.Portfolio,
    title: 'Portfolio',
  },
  {
    id: DashboardTab.NFTs,
    title: 'NFTs',
  },
  {
    id: DashboardTab.History,
    title: 'History',
  },
  {
    id: DashboardTab.Defi,
    title: 'DeFi',
  },
  {
    id: DashboardTab.Wallet,
    title: 'Wallet',
  },
]

const networks = [
  {
    id: DashboardNetwork.Ethereum,
    value: 'Ethereum',
    prefix: <img className="w-6 h-6 xl:w-9 xl:h-9" src="/images/currencies/ether.png" alt="" />,
  },
  {
    id: DashboardNetwork.Mixsome,
    value: 'Mixsome',
    prefix: <img className="w-6 h-6 xl:w-9 xl:h-9" src="/images/currencies/mixsome.png" alt="" />,
  },
]

const Dashboard: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState(DashboardTab.Portfolio)
  const [selectedNetworkId, setSelectedNetworkId] = useState(DashboardNetwork.Ethereum)
  const [netWorth, setNetWorth] = useState<number | string | null>(null)

  const handleTabClick = (id: DashboardTab) => setActiveTabId(id)

  const handleNetworkChange = (id: DashboardNetwork) => setSelectedNetworkId(id)

  const renderNetWorth = () => {
    if (netWorth) {
      return (
        <div className="mb-8 xl:mb-10">
          <div className="text-14 leading-14 font-sans xl:text-16 xl:leading-20 mb-4 opacity-60">
            Net worth
          </div>
          <div className="text-20 leading-14 font-mono xl:text-22 xl:leading-20">${netWorth}</div>
        </div>
      )
    }
    return null
  }

  const renderNetwork = () => {
    return (
      <div className="mb-8 xl:mb-10">
        <div className="text-14 leading-14 font-sans xl:text-16 xl:leading-20 mb-4 opacity-60">
          Select network
        </div>
        <ToggleButton
          activeId={selectedNetworkId}
          options={networks}
          onChange={handleNetworkChange}
        />
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTabId) {
      case DashboardTab.Portfolio:
        return <Portfolio onNetWorthChange={setNetWorth} />
      case DashboardTab.NFTs:
        return <NFTs networkId={selectedNetworkId} />
      case DashboardTab.History:
        return <History />
      case DashboardTab.Wallet:
        return <Transfer />
      case DashboardTab.Defi:
        return <Defi />
      default:
        return null
    }
  }

  const renderTabs = () => {
    return (
      <>
        <Tabs activeTabId={activeTabId} items={tabs} onClick={handleTabClick} />
        <div className="my-10">{renderTabContent()}</div>
      </>
    )
  }

  return (
    <>
      {renderNetWorth()}
      {renderTabs()}
    </>
  )
}

export default Dashboard
