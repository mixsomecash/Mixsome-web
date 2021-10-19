import React, { FormEvent, useContext } from 'react'
import { useGetApproval, useGetPoolData, useGetApprovalStatus } from 'hooks'

import CurrencyIcon from 'components/CurrencyIcon'
import { AppContext } from 'AppContext'

type Props = {
  onValueChange: (value: number) => void
}

const InvestInput = ({ onValueChange }: Props) => {
  // const { getSmth } = useTemp()
  const { account } = useContext(AppContext)

  const handleInvestValueChange = (event: FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget

    const amount = parseFloat(value)

    if (onValueChange) onValueChange(amount)
  }

  const renderBalance = async () => {
    if (!account) return null
    // const bal = getSmth()
    // console.log(bal)
    return <p className="font-regular">My balance: {} SOME</p>
  }

  if (!account) return null

  return (
    <div className="pt-5 xl:pt-0">
      <div className="w-full flex opacity-40 items-center">
        <p className="flex-1 font-regular font-14 xl:font-18 leading-18 xl:leading-24 mr-2 xl:mr-5"></p>
      </div>
      <div className="border border-solid border-black-opacity-38 mt-3 flex items-center">
        <input
          className="bg-silver flex-1 font-mono text-16 leading-21 xl:text-20 xl:leading-26 r-1 min-w-0 py-3 px-4"
          placeholder="0.00"
          maxLength={10}
          onChange={handleInvestValueChange}
          type="text"
        />
        <div className="flex items-center font-sans pr-4">
          <CurrencyIcon src="/images/currencies/mixsome.png" />
          <span className="pl-2 text-xl text-14 leading-18 xl:text-18 xl:leading-24">SOME</span>
        </div>
      </div>
    </div>
  )
}

export default InvestInput
