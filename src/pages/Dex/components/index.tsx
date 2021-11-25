import React, { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { Tabs } from 'antd'

import type { DexToken } from '../../../types/models/dex'
import { networks } from '../services/constants'
import { processTokenList } from '../services/utils'

import { CardComponent } from './card'

const Dex: React.FC = () => {
  const { Moralis } = useMoralis()

  const [tokenList, setTokenList] = useState<DexToken[]>([])

  const [chain, setChain] = useState<string>(networks[0].path)

  const handleTab = (value: string): void => {
    setChain(value)
  }

  useEffect(() => {
    const fetchTokens = () => {
      if (!Moralis?.Plugins?.oneInch) return undefined
      Moralis.Plugins.oneInch.getSupportedTokens({ chain }).then(tokens => {
        const processedTokenList = processTokenList(tokens.tokens)
        setTokenList(processedTokenList)
      })
      return undefined
    }
    fetchTokens()
  }, [Moralis.Plugins, chain])

  return (
    <>
      <Tabs
        onChange={handleTab}
        defaultActiveKey={networks[0].path}
        style={{ alignItems: 'center' }}
      >
        <Tabs.TabPane tab={<span>Ethereum</span>} key={networks[0].path}>
          <CardComponent tokenList={tokenList} chain={networks[0].path} />
        </Tabs.TabPane>
        <Tabs.TabPane tab={<span>Binance Smart Chain</span>} key={networks[1].path}>
          <CardComponent tokenList={tokenList} chain={networks[1].path} />
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

export default Dex
