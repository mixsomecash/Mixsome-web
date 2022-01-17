import React, { useMemo } from 'react'
import { useMoralis, useNativeBalance } from 'react-moralis'
import { Image, Select } from 'antd'

import { useERC20Balance } from 'hooks/useERC20Balance'

type SetAsset = {
  (value: any): void
}

interface AssetSelectorProps {
  setAsset: SetAsset
}

export const AssetSelector: React.FC<AssetSelectorProps> = (props: AssetSelectorProps) => {
  const { setAsset } = props
  const { Moralis } = useMoralis()
  const { assets } = useERC20Balance()
  const { data: nativeBalance, nativeToken } = useNativeBalance()

  const fullBalance = useMemo(() => {
    if (!assets || !nativeBalance || !nativeToken) return []
    return [
      ...assets,
      {
        balance: nativeBalance.balance,
        decimals: nativeToken.decimals,
        logo: null,
        name: nativeToken.name,
        symbol: nativeToken.symbol,
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      },
    ]
  }, [assets, nativeBalance, nativeToken])

  const handleChange = value => {
    const selectedToken = fullBalance?.find(token => token.symbol === value)
    setAsset(selectedToken)
  }

  return (
    <Select
      onChange={handleChange}
      size="large"
      placeholder="Select a token"
      style={{ width: '100%' }}
    >
      {fullBalance &&
        fullBalance.map(item => (
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
