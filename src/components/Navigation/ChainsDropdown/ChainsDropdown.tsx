import React from 'react'
import { useMoralis  } from 'react-moralis'
import { useChain } from 'hooks'
import { IconOption } from 'components/Dropdown/types'
import Dropdown from '../../Dropdown'
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo } from './Logos'

const ChainsDropdown = () => {
  const { chainId } = useMoralis()
  const { switchNetwork } = useChain()

  const handleOptionClick = async (option: IconOption) => {
    await switchNetwork(option.key)
  }
  const options: IconOption[] = [
    {
      key: '0x1',
      icon: <ETHLogo />,
      label: 'Ethereum',
      onClick: handleOptionClick,
    },
    {
      key: '0x38',
      icon: <BSCLogo />,
      label: 'Binance',
      onClick: handleOptionClick,
    },
    {
      key: '0x89',
      icon: <PolygonLogo />,
      label: 'Polygon',
      onClick: handleOptionClick,
    },
    {
      key: '0x1',
      icon: <AvaxLogo />,
      label: 'Avalanche',
      onClick: handleOptionClick,
    },
  ]

  return <Dropdown options={options} selectedOptionKey={chainId} />
}

export default ChainsDropdown
