import React from 'react'
import Text from 'antd/lib/typography/Text'

import { Quote, DexToken } from '../../../types/models/dex'

interface PriceSwapProps {
  quote: Quote
  fromToken: DexToken
  toToken: DexToken
  toTokenUSD: number | undefined
}

export const PriceSwap: React.FC<PriceSwapProps> = (props: PriceSwapProps) => {
  const { quote, fromToken, toToken, toTokenUSD } = props

  const { fromTokenAmount, toTokenAmount } = quote

  const { symbol: fromSymbol } = fromToken
  const { symbol: toSymbol } = toToken

  const tokenValue = (value, decimals) => (decimals ? value / 10 ** decimals : value)

  const pricePerToken =
    tokenValue(fromTokenAmount, fromToken.decimals) / tokenValue(toTokenAmount, toToken.decimals)

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px' }}>
      <Text>Price:</Text>
      <Text>
        {`1 ${toSymbol} = ${pricePerToken.toFixed(6)} ${fromSymbol} ($${toTokenUSD?.toFixed(6)})`}
      </Text>
    </div>
  )
}
