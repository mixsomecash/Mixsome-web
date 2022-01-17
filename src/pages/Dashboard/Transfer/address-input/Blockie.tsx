import React from 'react'
import Blockies from 'react-blockies'
import { useMoralis } from 'react-moralis'
import { Skeleton } from 'antd'

interface BlockieProps {
  address: string
  currentWallet?: string
  scale: number
  size: number
}

export const Blockie: React.FC<BlockieProps> = (props: BlockieProps) => {
  const { address, currentWallet, scale, size } = props
  const { account } = useMoralis()
  if (!address && !account) return <Skeleton.Avatar active size={40} />

  return (
    <Blockies
      seed={currentWallet ? account?.toLowerCase() : address.toLowerCase()}
      className="identicon"
      address={address}
      scale={scale}
      size={size}
    />
  )
}

export default Blockie
