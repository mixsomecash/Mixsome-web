import React from 'react'
import { useMoralis } from 'react-moralis'
import { getCurrencyIconFileName } from 'utils/currencyIcon'
import { Currency } from 'constants/currency'
import { useChain } from 'hooks'
import { IconOption } from 'components/Dropdown/types'
import Dropdown from '../../Dropdown'
import CurrencyIcon from '../../CurrencyIcon'

const ChainsDropdown = () => {
  const { chainId } = useMoralis()
  const chain = useChain()

  const renderCurrencyIcon = (currency: Currency) => {
    const iconUrl = `/images/currencies/${getCurrencyIconFileName(currency)}`
    return <CurrencyIcon src={iconUrl} />
  }

  const handleOptionClick = async (option: IconOption) => {
    await chain.switchNetwork(option.key)
  }

  const options: IconOption[] = [
    {
      key: '0x1',
      icon: renderCurrencyIcon(Currency.Ether),
      label: 'Ethereum',
      onClick: handleOptionClick,
    },
    {
      key: '0x38',
      icon: renderCurrencyIcon(Currency.Binance),
      label: 'Binance',
      onClick: handleOptionClick,
    },
  ]

  return <Dropdown options={options} selectedOptionKey={chainId} />
}

export default ChainsDropdown
