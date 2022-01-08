/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import Blockies from 'react-blockies'
import React, { useMoralis } from 'react-moralis'
import { Skeleton } from 'antd'

function Blockie(props) {
  const { account } = useMoralis()
  if (!props.address && !account) return <Skeleton.Avatar active size={40} />

  return (
    <Blockies
      seed={props.currentWallet ? account?.toLowerCase() : props.address.toLowerCase()}
      className="identicon"
      {...props}
    />
  )
}

export default Blockie
