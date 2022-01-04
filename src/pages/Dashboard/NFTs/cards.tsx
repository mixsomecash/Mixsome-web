import React, { useState, useMemo } from 'react'
import { Input } from 'antd'

import { NftToken, SetVisibility, OpenNotification } from '../../../types/models/nft'
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

  const names = ['Faucet NFT', 'Crooked back NFT', 'Ximera Muscle NFT']

  const mockNfts = nfts.map((nft, index) => ({ ...nft, name: names[index] }))

  const [filter, setFilter] = useState<string>('')

  const handleChange = event => setFilter(event.target.value)

  const result = useMemo(() => {
    return mockNfts.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
  }, [filter, mockNfts])

  return (
    <>
      <Search
        placeholder="Start typing name.."
        allowClear
        size="large"
        value={filter}
        onChange={handleChange}
        style={{ width: '240px', marginBottom: '16px' }}
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
        {result.map(nft => {
          // nft = verifyMetadata(nft)
          return (
            <Card
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
