import React from 'react'
import { Button, InvestInput } from 'components'
import { MoralisToken } from 'types/moralis'

type Props = {
  token0: MoralisToken
  token1: MoralisToken
  isSell?: boolean
}

const TransactionForm = ({ token0, token1, isSell }: Props) => {
  return (
    <div>
      <div className="mt-5">{isSell ? 'Sell' : 'Pay with'}</div>
      <InvestInput onValueChange={() => {}} symbol={token0.symbol} />
      <div className="mt-5">Receive</div>
      <InvestInput onValueChange={() => {}} symbol={token1.symbol} disabled />
      <div className="my-7 text-center">
        <Button text="Confirm" onClick={() => {}} disabled />
      </div>
    </div>
  )
}

export default TransactionForm
