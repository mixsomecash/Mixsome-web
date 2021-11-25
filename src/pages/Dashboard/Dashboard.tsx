import React, { useState } from 'react'

import { Tabs, ToggleButton } from 'components'

import Portfolio from './Portfolio'
import NFTs from './NFTs'
import History from './History'
import Defi from './Defi'

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
    title: 'Defi',
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

const Dashboard = () => {
  const [activeTabId, setActiveTabId] = useState(DashboardTab.Portfolio)
  const [selectedNetworkId, setSelectedNetworkId] = useState(DashboardNetwork.Ethereum)

  const handleTabClick = (id: DashboardTab) => setActiveTabId(id)

  const handleNetworkChange = (id: DashboardNetwork) => setSelectedNetworkId(id)

  const renderNetWorth = () => {
    return (
      <div className="mb-8 xl:mb-10">
        <div className="text-14 leading-14 font-sans xl:text-16 xl:leading-20 mb-4 opacity-60">
          Net worth
        </div>
        <div className="text-20 leading-14 font-mono xl:text-22 xl:leading-20">10,000 $</div>
      </div>
    )
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
        return <Portfolio networkId={selectedNetworkId} />
      case DashboardTab.NFTs:
        return <NFTs networkId={selectedNetworkId} />
      case DashboardTab.History:
        return <History />
      case DashboardTab.Defi:
        return <Defi networkId={selectedNetworkId} />
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
