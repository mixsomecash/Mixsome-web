import React, { useState } from 'react'
import { Alert, notification } from 'antd'
import { useMoralis, useNFTBalances } from 'react-moralis'

import { Grid } from './grid'
import { Modal } from './modal'

import { DashboardNetwork } from '../types'

type Props = { networkId: DashboardNetwork }

const NFTs: React.FC<Props> = ({ networkId }: Props) => {
  const { data: NFTBalances } = useNFTBalances()

  const { error, isFetching } = useNFTBalances()

  const { chainId, isAuthenticated } = useMoralis()

  const [visible, setVisibility] = useState(false)
  const [warning, setWarning] = useState<string | null>(null)
  const [address, setAddress] = useState<string>('')

  const onCancel = () => {
    setWarning(null)
    setAddress('')
    setVisibility(false)
  }

  const openNotification = placement => {
    notification.info({
      message: 'OPENSEA MARKET',
      description: 'OpenSea integration coming soon!',
      placement,
    })
  }

  if (!isAuthenticated) return <Alert message="Please connect to your wallet" type="warning" />

  if (error) return <Alert message="Could not fetch NFTs!" type="error" />

  return (
    <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
      <div className="pb-4 xl:flex items-center">
        <p className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">
          NFT Balance
        </p>
      </div>

      <div>
        <Grid
          chainId={chainId}
          loading={isFetching}
          NFTBalances={NFTBalances}
          openNotification={openNotification}
          setVisibility={setVisibility}
        />

        <Modal
          visible={visible}
          onCancel={onCancel}
          warning={warning}
          setWarning={setWarning}
          address={address}
          setAddress={setAddress}
        />
      </div>
    </div>
  )
}

export default NFTs
