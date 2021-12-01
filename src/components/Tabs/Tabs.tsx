import React from 'react'

import Tab from './Tab'

type TabInfo = {
  id: number
  title: string
}

type Props = {
  items: Array<TabInfo>
  activeTabId: number
  onClick: (id: number) => void
}

const Tabs = ({ items, activeTabId, onClick }: Props) => {
  const handleTabClick = (id: number) => onClick(id)

  const renderTab = (tab: TabInfo, index: number) => {
    const isActive = tab.id === activeTabId

    return (
      <Tab
        key={index}
        id={tab.id}
        title={tab.title}
        isActive={isActive}
        onClick={handleTabClick}
        isFirst={index === 0}
      />
    )
  }

  return <div className="flex my-4 border-b border-extra-light">{items.map(renderTab)}</div>
}

export default Tabs
