import React from 'react'

import { getCurrencyIconFileName } from 'utils/currencyIcon'
import { Currency } from 'constants/currency'
import { useChain } from 'hooks'

import Dropdown from '../../Dropdown'
import CurrencyIcon from '../../CurrencyIcon'

const NavigationInfo = () => {
  const chain = useChain()

  const renderCurrencyIcon = (currency: Currency) => {
    const iconUrl = `/images/currencies/${getCurrencyIconFileName(currency)}`
    return <CurrencyIcon src={iconUrl} />
  }

  const chains = [
    {
      value: 'ether',
      icon: renderCurrencyIcon(Currency.Ether),
      label: 'Ether',
      onClick: async () => {
        await chain.switchNetwork('0x1')
      },
    },
    {
      value: 'binance',
      icon: renderCurrencyIcon(Currency.Binance),
      label: 'Binance',
      onClick: async () => {
        await chain.switchNetwork('0x38')
      },
    },
  ]
  return <Dropdown options={chains} />
}

export default NavigationInfo
