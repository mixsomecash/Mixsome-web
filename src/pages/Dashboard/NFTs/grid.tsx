import React from 'react'
import { Skeleton } from 'antd'

import { SetVisibility, OpenNotification } from '../../../types/models/nft'
import { Cards } from './cards'

interface GridProps {
  chainId: string | null
  loading: boolean
  NFTBalances: any
  openNotification: OpenNotification
  setVisibility: SetVisibility
}

export const Grid: React.FC<GridProps> = ({
  chainId,
  loading,
  NFTBalances,
  openNotification,
  setVisibility,
}: GridProps) => {
  return (
    <Skeleton loading={loading}>
      {NFTBalances?.result && (
        <Cards
          nfts={NFTBalances.result}
          chainId={chainId}
          setVisibility={setVisibility}
          openNotification={openNotification}
        />
      )}
    </Skeleton>
  )
}
