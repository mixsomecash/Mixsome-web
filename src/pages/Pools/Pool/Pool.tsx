import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useMoralis } from 'react-moralis'
import { getCurrencyIconFileName } from 'utils/currencyIcon'
import { Currency } from 'constants/currency'
import { Button, ErrorMessage, Loader, Progress } from 'components'
import { networkConfigs } from 'utils/networks'
import { PoolInfo, PoolContractData } from './types'
import { getPoolContractData, getPoolMaturity, withdrawTokens } from './PoolHelper'

type Props = {
  pool: PoolInfo
}

const Pool = ({ pool }: Props) => {
  const { Moralis, chainId, account } = useMoralis()
  const [poolContractData, setPoolContractData] = useState<PoolContractData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!account) {
      return
    }

    ;(async () => {
      setIsLoading(true)
      const poolData = await getPoolContractData(pool, account)
      if (poolData) {
        setPoolContractData(poolData)
      }
      setIsLoading(false)
    })()
  }, [Moralis.Web3, account, pool])

  const handleLockClick = () => {
    alert('Pool is full')
  }

  const handleWithdrawClick = async () => {
    if (!poolContractData) {
      return
    }
    if (chainId && chainId !== pool.chainId) {
      alert(`Please select ${networkConfigs[pool.chainId].chainName} network and try again`)
      return
    }
    if (getPoolMaturity(poolContractData) < Date.now()) {
      await withdrawTokens(pool)
    } else {
      alert('Maturity period is not over yet')
    }
  }

  const poolProperties =
    poolContractData && chainId
      ? [
          {
            label: 'Deposit',
            value: poolContractData.token.symbol,
          },
          {
            label: 'APY',
            value: `${poolContractData.apy}%`,
          },
          {
            label: 'Total Liquidity',
            value: `${Moralis.Units.FromWei(
              poolContractData.stakedTotal,
              parseFloat(poolContractData.token.decimals),
            )} ${poolContractData.token.symbol}`,
          },
          {
            label: 'Network',
            value: networkConfigs[pool.chainId].chainName,
          },
          {
            label: 'Status',
            value: Date.now() > poolContractData.closingTime ? 'Closed' : 'Open',
          },
          {
            label: 'Maturity',
            value: new Date(getPoolMaturity(poolContractData)).toDateString(),
          },
          {
            label: 'You have staked',
            value: `${Moralis.Units.FromWei(
              poolContractData.accountStaked,
              parseFloat(poolContractData.token.decimals),
            )} ${[poolContractData.token.symbol]}`,
          },
        ]
      : null

  const renderCurrencyIcon = (currency: Currency, index: number) => {
    const iconUrl = `/images/currencies/${getCurrencyIconFileName(currency)}`

    const className = classNames('w-12', 'h-12', {
      '-ml-2.5': index > 0,
    })

    return (
      <div key={index} className={className}>
        <img className="w-full h-full" src={iconUrl} alt="" />
      </div>
    )
  }

  return (
    <div className="bg-white w-full xl:max-w-max select-none xl:mr-20 xl:mb-16 mb-5 py-2 px-4">
      {poolContractData && chainId && !isLoading && (
        <div className="m-10">
          <div className="flex mb-10">{pool.curencies.map(renderCurrencyIcon)}</div>
          <div className="mb-16">
            {poolProperties?.map(poolProperty => (
              <div className="flex">
                <span className="text-14 xl:text-16 leading-42 opacity-60">
                  {poolProperty.label}
                </span>
                <span className="font-mono text-14 xl:text-16 leading-42 ml-auto">
                  {poolProperty.value}
                </span>
              </div>
            ))}
            <Progress
              completed={Math.round(
                (poolContractData.stakedTotal / poolContractData.poolSize) * 100,
              )}
            />
          </div>
          <div className="flex justify-center">
            <Button text="Lock" invert onClick={handleLockClick} />
            <div className="ml-3" />
            <Button text="Withdraw" onClick={handleWithdrawClick} />
          </div>
        </div>
      )}
      {isLoading && (
        <div className="text-center">
          <Loader />
        </div>
      )}
      {!isLoading && (!poolContractData || !chainId) && (
        <ErrorMessage message="An error occured while getting pool data" />
      )}
    </div>
  )
}

export default Pool
