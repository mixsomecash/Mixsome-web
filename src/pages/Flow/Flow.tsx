import React from 'react'
import { useParams, Redirect } from 'react-router-dom'

import DefiShark from './DefiShark'
import DefiCrab from './DefiCrab'
import Invest from './Invest'

const Flow = () => {
  const { id } = useParams<{ id: string }>()

  if (id === '1') {
    return (
      <Invest
        token0Address="0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
        token1Address="0xe9e7cea3dedca5984780bafc599bd69add087d56"
        exchange="pancakeswapv2"
        chainId="0x38"
        description="Wrapped BNB and BUSD Pair"
      />
    )
  }

  if (id === '2') {
    return <DefiCrab />
  }

  return <Redirect to="/" />
}

export default Flow
