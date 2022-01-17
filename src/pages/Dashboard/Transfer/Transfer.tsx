import React, { useState, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { CreditCardOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import Text from 'antd/lib/typography/Text'

import { AddressInput } from './address-input/AddressInput'
import { AssetSelector } from './asset-selector/AssetSelector'
import { TransferComponent } from './transfer-component/TransferComponent'

const Transfer: React.FC = () => {
  const { enableWeb3, isWeb3Enabled, web3EnableError } = useMoralis()

  if (!isWeb3Enabled) enableWeb3()

  const [asset, setAsset] = useState<any>(null)
  const [amount, setAmount] = useState<any>(null)
  const [receiver, setReceiver] = useState<any>(null)
  const [tx, setTx] = useState<any>(null)
  const [isPending, setIsPending] = useState<boolean>(false)

  useEffect(() => {
    if (asset && amount && receiver) {
      setTx({ amount, receiver, asset })
    } else {
      setTx(null)
    }
  }, [amount, asset, receiver])

  return (
    <div style={{ alignItems: 'center', width: '100%' }}>
      <div>
        <div style={{ textAlign: 'center' }}>
          <h3>Transfer Assets</h3>
        </div>

        <AddressInput autoFocus onChange={setReceiver} />

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '80px', width: '100%' }}>
            <Text strong>Amount:</Text>
          </div>
          <Input
            size="large"
            prefix={<CreditCardOutlined />}
            onChange={event => {
              setAmount(event.target.value)
            }}
          />
        </div>

        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: '80px', width: '100%' }}>
            <Text strong>Asset:</Text>
          </div>
          <AssetSelector setAsset={setAsset} />
        </div>

        {web3EnableError && <p style={{ color: 'red' }}>Could not enable Web3 services!</p>}

        {isWeb3Enabled && tx && (
          <TransferComponent isPending={isPending} setIsPending={setIsPending} tx={tx} />
        )}
      </div>
    </div>
  )
}

export default Transfer
