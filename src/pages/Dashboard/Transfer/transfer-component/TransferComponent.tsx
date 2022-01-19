import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { Button, notification } from 'antd'

import type { Transaction } from 'types/models/wallet'

type SetIsPending = {
  (value: boolean): void
}

interface TransferComponentProps {
  isPending: boolean
  setIsPending: SetIsPending
  tx: Transaction
}

export const TransferComponent: React.FC<TransferComponentProps> = (
  props: TransferComponentProps,
) => {
  const { isPending, setIsPending, tx } = props

  const { Moralis, enableWeb3, isWeb3Enabled } = useMoralis()

  useEffect(() => {
    if (!isWeb3Enabled) enableWeb3()
  }, [enableWeb3, isWeb3Enabled])

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: 'bottomRight',
      message,
      description,
      onClick: () => {
        console.log('Notification Clicked!')
      },
    })
  }

  const transfer = async () => {
    let options = {}

    switch (tx.asset.token_address) {
      case '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee':
        options = {
          native: 'native',
          amount: Moralis.Units.ETH(tx.amount),
          receiver: tx.receiver,
          awaitReceipt: false,
        }
        break
      default:
        options = {
          type: 'erc20',
          amount: Moralis.Units.Token(tx.amount, tx.asset.decimals),
          receiver: tx.receiver,
          contractAddress: tx.asset.token_address,
          awaitReceipt: false,
        }
    }

    setIsPending(true)

    const txStatus: any = await Moralis.Web3.transfer(options)

    txStatus
      .on('transactionHash', hash => {
        openNotification({
          message: '🔊 New Transaction',
          description: `${hash}`,
        })
        console.log('🔊 New Transaction', hash)
      })
      .on('receipt', receipt => {
        openNotification({
          message: '📃 New Receipt',
          description: `${receipt.transactionHash}`,
        })
        console.log('🔊 New Receipt: ', receipt)
        setIsPending(false)
      })
      .on('error', error => {
        openNotification({
          message: '📃 Error',
          description: `${error.message}`,
        })
        console.error(error)
        setIsPending(false)
      })
  }

  return (
    <Button
      type="primary"
      size="large"
      loading={isPending}
      style={{ width: '100%', marginTop: '25px' }}
      onClick={() => transfer()}
      disabled={!tx}
    >
      Transfer💸
    </Button>
  )
}
