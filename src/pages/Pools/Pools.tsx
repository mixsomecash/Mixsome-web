import React, { useState, useContext, useCallback, useEffect } from 'react'

import { Currency } from 'constants/currency'
import { PoolModel } from 'types/models'
import { useMoralis } from 'react-moralis'
import { useGetPoolData, useGetApprovalStatus, useGetTotalStaked } from 'hooks'
import { Button, InvestInput, LinkWithArrow, Loader } from 'components'
import tokenContractAbi from 'utils/StakingPool.json'
import { AbiItem } from 'web3-utils'

import Pool from './Pool'
import StakeModal from './StakeModal'

const pools: Array<PoolModel> = [
  {
    address: '0x75EFCeb7Ba78CF4C795eDa462d111baEBf707faE',
    crypto: '0x3E8FFc8c3Cb0DB3081Df85DeC91B63abBbe99F71',
    curencies: [Currency.Ether, Currency.MixsomeCoin],
    deposit: 'SOME',
    apy: '250.0%',
    totalLiquidity: '300k SOME',
    network: 'ETH MAINNET',
    status: 'CLOSED/Maturity on 2021/12/21',
  },
  {
    address: '0xc56fFEFE53CE0fdf80eE7071d250E86d4819f3Dc',
    crypto: '0xc039C13470be809beD1C2CD42339Ccb22e0970f2',
    curencies: [Currency.Binance, Currency.MixsomeCoin],
    deposit: 'SOME',
    apy: '250.0%',
    totalLiquidity: '500k SOME',
    network: 'BSC NETWORK',
    status: 'CLOSED/Maturity on 2022/01/02',
  },
]

const Pools = () => {
  const [investValue, setInvestValue] = useState<number | null>(null)
  // const { getStaked } = useGetTotalStaked('0xc56fFEFE53CE0fdf80eE7071d250E86d4819f3Dc')
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isStakeButtonDisabled, setIsStakeButtonDisabled] = useState(true)
  const [selectedPoolAddress, setSelectedPoolAddress] = useState<string | null>(null)
  const [selectedCryptoAddress, setSelectedCryptoAddress] = useState<string | null>(null)
  const [selectedStakeTotal, setStakeTotal] = useState<string | null>(null)
  const [selectedStaked, setStaked] = useState<string | null>(null)
  const { approvalStatus } = useGetApprovalStatus('0x3E8FFc8c3Cb0DB3081Df85DeC91B63abBbe99F71')
  const { user, isAuthenticated, web3, Moralis } = useMoralis()

  const handleModalCloseClick = () => {
    setIsModalVisible(false)
  }

  const handleLockClick = (pool: PoolModel) => async () => {
    const connector = await Moralis.Web3.enable()
    const chainIdDec = await connector.eth.getChainId()
    setSelectedPoolAddress(pool.address)
    setSelectedCryptoAddress(pool.crypto)

    if (chainIdDec === 1 && pool.crypto === '0x3E8FFc8c3Cb0DB3081Df85DeC91B63abBbe99F71') {
      // setIsModalVisible(true)
      alert('Pool is full')
    } else if (chainIdDec === 56 && pool.crypto === '0xc039C13470be809beD1C2CD42339Ccb22e0970f2') {
      alert('Pool is full')
      // setIsModalVisible(true)
    } else {
      alert('Please change your network to ETH Mainnet or BSC Network and try again')
    }
  }

  const handleUnlockClick = (pool: PoolModel) => () => {
    // Do something
    // alert(pool.address)
    console.log(selectedStakeTotal)
    alert('Maturity period is not over yet')
    setIsModalVisible(false)
  }

  const handleValueChange = (value: number) => {
    setInvestValue(value)
  }

  const renderInvestControl = () => {
    return (
      <div className="xl:w-1/3">
        <InvestInput
          onValueChange={handleValueChange}
          symbol="SOME"
          iconUrl="/images/currencies/mixsome.png"
        />
      </div>
    )
  }

  const renderPool = (pool: PoolModel, index: number) => {
    return (
      <Pool
        key={index}
        pool={pool}
        onLockClick={handleLockClick(pool)}
        onUnlockClick={handleUnlockClick(pool)}
        totalLiquidity={selectedStakeTotal!}
      />
    )
  }
  const renderPools = () => {
    return <div className="flex xl:px-10 flex-wrap">{pools.map(renderPool)}</div>
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full xl:px-10 pb-10 xl:flex xl:mt-8">
        <div className="xl:w-2/3 mr-5">
          <div className="mb-10">
            <LinkWithArrow url="/" text="Go back" arrowSide="left" />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="xl:px-10 pb-10 xl:flex xl:mt-8">
          <div>
            <p className="font-medium text-20 leading-26 xl:text-32 xl:leading-42 mb-5">
              Stake SOME tokens to earn APY
            </p>
          </div>
        </div>
        {renderPools()}
      </div>
      <StakeModal
        isVisible={isModalVisible}
        address={selectedPoolAddress}
        crypto={selectedCryptoAddress}
        onClose={handleModalCloseClick}
      />
    </div>
  )
}

export default Pools
