import React from 'react'
import { useMoralis } from 'react-moralis'
import { Image, Select } from 'antd'

import type { Erc20Token } from 'types/models/wallet'

type SetAsset = {
  (value: Erc20Token | undefined): void
}

interface AssetSelectorProps {
  asset: Erc20Token | undefined
  assets: Erc20Token[]
  setAsset: SetAsset
}

export const AssetSelector: React.FC<AssetSelectorProps> = (props: AssetSelectorProps) => {
  const { asset, assets, setAsset } = props
  const { Moralis } = useMoralis()

  const handleChange = value => {
    const selectedToken = assets?.find(token => token.symbol === value)
    setAsset(selectedToken)
  }

  return (
    <Select
      onChange={handleChange}
      size="large"
      placeholder="Select a token"
      value={asset?.name}
      style={{ width: '100%' }}
    >
      {assets &&
        assets.map(item => (
          <Select.Option value={item.symbol} key={item.symbol}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                gap: '8px',
              }}
            >
              <Image
                src={item.logo || 'https://etherscan.io/images/main/empty-token.png'}
                alt="No logo"
                width="24px"
                height="24px"
                preview={false}
                style={{ borderRadius: '15px' }}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '90%',
                }}
              >
                <p>{item.symbol}</p>
                {item.balance && (
                  <p style={{ alignSelf: 'right' }}>
                    ({parseFloat(Moralis.Units.FromWei(item.balance, item.decimals).toFixed(6))})
                  </p>
                )}
              </div>
            </div>
          </Select.Option>
        ))}
    </Select>
  )
}
