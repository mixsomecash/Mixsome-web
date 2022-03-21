import React, { useState, useEffect, useMemo } from 'react'
import { useNativeBalance } from 'react-moralis'
import { CreditCardOutlined } from '@ant-design/icons'
import { Button, Card, Input, Skeleton } from 'antd'
import Text from 'antd/lib/typography/Text'

import type { Erc20Token, Transaction } from 'types/models/wallet'

import { useERC20Balance } from 'hooks/useERC20Balance'
import { AddressInput } from './address-input/AddressInput'
import { AssetSelector } from './asset-selector/AssetSelector'
import { Title } from './title/Title'
import { TransferComponent } from './transfer-component/TransferComponent'

const Transfer: React.FC = () => {
  const { assets, error, isLoading } = useERC20Balance()
  const { data: nativeBalance, nativeToken } = useNativeBalance()
  const [asset, setAsset] = useState<Erc20Token | undefined>(undefined)
  const [receiver, setReceiver] = useState<string | undefined>(undefined)
  const [amount, setAmount] = useState<string | undefined>(undefined)
  const [tx, setTx] = useState<Transaction | undefined>(undefined)
  const [isPending, setIsPending] = useState<boolean>(false)

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
        thumbnail: null,
        token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      },
    ]
  }, [assets, nativeBalance, nativeToken])

  useEffect(() => {
    if (asset && amount && receiver) {
      setTx({ amount, receiver, asset })
    } else {
      setTx(undefined)
    }
  }, [amount, asset, receiver])

  if (error) return <p>{error}</p>

  return (
    <Card title={<Title text="Transfer Assets" />}>
      <Skeleton loading={isLoading}>
        <AddressInput autoFocus onChange={setReceiver} placeholder="Enter address.." />

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '80px', width: '100%' }}>
            <Text strong>Amount:</Text>
          </div>
          <Input
            size="large"
            prefix={<CreditCardOutlined />}
            placeholder="Enter amount.."
            onChange={event => {
              setAmount(event.target.value)
            }}
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '80px', width: '100%' }}>
            <Text strong>Asset:</Text>
          </div>
          <AssetSelector asset={asset} assets={fullBalance} setAsset={setAsset} />
        </div>

        {tx ? (
          <TransferComponent isPending={isPending} setIsPending={setIsPending} tx={tx} />
        ) : (
          <Button type="primary" size="large" style={{ width: '100%', marginTop: '25px' }} disabled>
            Transfer💸
          </Button>
        )}
      </Skeleton>
    </Card>
  )
}

export default Transfer
