import React, { useState, useMemo } from 'react'
import { Input } from 'antd'

import { NftToken, SetVisibility, OpenNotification } from '../../../types/models/nft'
import { useVerifyMetadata } from '../../../hooks/useVerifyMetadata'
import { Card } from './card'

const { Search } = Input

interface CardsProps {
  nfts: NftToken[]
  chainId: string | null
  setVisibility: SetVisibility
  openNotification: OpenNotification
}

export const Cards: React.FC<CardsProps> = (props: CardsProps) => {
  const { nfts, chainId, setVisibility, openNotification } = props

  const [filter, setFilter] = useState<string>('')

  const handleChange = event => setFilter(event.target.value)

  const filteredNFTs = useMemo(() => {
    return nfts.filter(item => item?.name?.toLowerCase().includes(filter.toLowerCase()))
  }, [filter, nfts])

  const { verifyMetadata } = useVerifyMetadata()

  return (
    <>
      <Search
        placeholder="Start typing the name.."
        allowClear
        size="large"
        value={filter}
        onChange={handleChange}
        style={{ width: '300px', marginBottom: '16px' }}
      />

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          WebkitBoxPack: 'start',
          justifyContent: 'flex-start',
          width: '100%',
          gap: '10px',
        }}
      >
        {filteredNFTs.map(nftProp => {
          const nft = verifyMetadata(nftProp)
          return (
            <Card
              key={nft.token_id}
              chainId={chainId}
              nft={nft}
              setVisibility={setVisibility}
              openNotification={openNotification}
            />
          )
        })}
      </div>
    </>
  )
}
