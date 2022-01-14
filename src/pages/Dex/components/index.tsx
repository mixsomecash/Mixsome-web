import React, { useState } from 'react'
import { Tabs } from 'antd'

import { Chain } from './_chain'

const Dex: React.FC = () => {
  const [path, setPath] = useState('eth')

  const handleTab = (value: string): void => {
    setPath(value)
  }

  return (
    <>
      <Tabs onChange={handleTab} defaultActiveKey={path} style={{ alignItems: 'center' }}>
        <Tabs.TabPane tab={<span>Ethereum</span>} key="eth">
          <Chain path="eth" />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key="bsc">
          <Chain path="bsc" />
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

export default Dex
