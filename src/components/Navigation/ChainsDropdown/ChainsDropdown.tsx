import React, { useContext } from 'react'

import { getCurrencyIconFileName } from 'utils/currencyIcon'
import { Currency } from 'constants/currency'
import { useChain } from 'hooks'
import { IconOption } from 'components/Dropdown/types'
import { AppContext } from 'AppContext'
import Dropdown from '../../Dropdown'
import CurrencyIcon from '../../CurrencyIcon'

const ChainsDropdown = () => {
  const app = useContext(AppContext)
  const chain = useChain()

  const { chainId: networkId } = app

  const renderCurrencyIcon = (currency: Currency) => {
    const iconUrl = `/images/currencies/${getCurrencyIconFileName(currency)}`
    return <CurrencyIcon src={iconUrl} />
  }

  const handleOptionClick = async (option: IconOption) => {
    await chain.switchNetwork(option.key)
  }

  const options = [
    {
      key: '0x1',
      icon: renderCurrencyIcon(Currency.Ether),
      label: 'Ether',
      onClick: handleOptionClick,
    },
    {
      key: '0x38',
      icon: renderCurrencyIcon(Currency.Binance),
      label: 'Binance',
      onClick: handleOptionClick,
    },
  ]

  return <Dropdown options={options} selectedOptionKey={networkId} />
}

export default ChainsDropdown
