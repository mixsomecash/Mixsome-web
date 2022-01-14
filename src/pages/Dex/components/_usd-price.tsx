import React from 'react'

interface USDPriceProps {
  usdPrice: number
}

export const USDPrice: React.FC<USDPriceProps> = (props: USDPriceProps) => {
  const { usdPrice } = props

  return <span>{`~$ ${usdPrice?.toFixed(4)}`}</span>
}
