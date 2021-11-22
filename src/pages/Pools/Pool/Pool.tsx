import React, { useEffect, useState, useContext, useMemo } from 'react'
import classNames from 'classnames'
import { getCurrencyIconFileName } from 'utils/currencyIcon'
import { Currency } from 'constants/currency'
import { Button, Progress } from 'components'
import { PoolModel } from 'types/models'
import { getAccountAddress, getSigner, toEth } from 'clients/ethereum'
import { useGetPoolData, useGetApprovalStatus, useGetTotalStaked, useGetApproval } from 'hooks'
import { useMoralis } from 'react-moralis'
import tokenContractAbi from 'utils/StakingPool.json'
import { AbiItem } from 'web3-utils'

type Props = {
  pool: PoolModel
  onLockClick: () => void
  onUnlockClick: () => void
  totalLiquidity: string
}
const Pool = ({ pool, onLockClick, onUnlockClick, totalLiquidity }: Props) => {
  const { user, isAuthenticated, web3, Moralis } = useMoralis()
  const { getStaked } = useGetTotalStaked('0xc56fFEFE53CE0fdf80eE7071d250E86d4819f3Dc')
  const [isNetwork, setNetwork] = useState(0)
  const [progressValue, setProgressValue] = useState(0)
  const [TotalValue, setTotalValue] = useState(0)
  const [progressBarValue, setProgressBarValue] = useState(0)
  const [userStaked, setUserStaked] = useState(0)
  const [userAddress, setUserAddress] = useState('0x')

  // const userAddress = useMemo(() => user?.attributes.ethAddress, [user])
  const useTransactions = () => {
    const [address, setAddress] = useState()
    useEffect(() => {
      if (isAuthenticated) {
        setAddress(user?.attributes.ethAddress)
        console.log(address)
      }
    }, [address])
  }

  useEffect(() => {
    // Run! Like go get some data from an API.
    const get = async () => {
      try {
        const connector = await Moralis.Web3.enable()
        const chainIdDec = await connector.eth.getChainId()
        if (chainIdDec === 1) {
          setNetwork(1)
        } else if (chainIdDec === 56) {
          console.log('a')
        }
        console.log(await connector.eth.getChainId())
        const staked = new connector.eth.Contract(tokenContractAbi as AbiItem[], pool.address)
        const tx1 = await staked.methods.stakedTotal().call()
        const tx2 = await staked.methods.poolSize().call()
        console.log(userAddress)
        const tx3 = await staked.methods.stakeOf(await getAccountAddress()).call()
        setProgressValue(tx1)
        setTotalValue(tx2)
        setUserStaked(tx3)
        console.log(tx1, tx2, tx3)
        setProgressBarValue(Math.round(tx1) / Math.round(tx2))
      } catch {
        console.log('Failed to get address')
      }
    }
    get()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    <div className="pool__container bg-white w-full xl:max-w-max select-none xl:mr-20 xl:mb-16 mb-5">
      <div className="m-10">
        <div className="flex mb-10">{pool.curencies.map(renderCurrencyIcon)}</div>
        <div className="mb-16">
          <ul>
            <li>
              <div className="flex">
                <span className="text-14 xl:text-16 leading-42 opacity-60">Deposit</span>
                <span className="font-mono text-14 xl:text-16 leading-42 ml-auto">
                  {pool.deposit}
                </span>
              </div>
            </li>
            <li>
              <div className="flex">
                <span className="text-14 xl:text-16 leading-42 opacity-60">APY</span>
                <span className="font-mono text-14 xl:text-16 leading-42 ml-auto">{pool.apy}</span>
              </div>
            </li>
            <li>
              <div className="flex">
                <span className="text-14 xl:text-16 leading-42 opacity-60">Total Liquidity</span>
                <span className="font-mono text-14 xl:text-16 leading-42 ml-auto">
                  {pool.totalLiquidity}
                </span>
              </div>
              <div className="flex">
                <span className="text-14 xl:text-16 leading-42 opacity-60">Must use: </span>
                <span className="font-mono text-14 xl:text-16 leading-42 ml-auto">
                  {pool.network}
                </span>
              </div>
              <div className="flex">
                <span className="text-14 xl:text-16 leading-42 opacity-60">
                  You Have Already Staked:
                </span>
                <span className="font-mono text-14 xl:text-16 leading-42 ml-auto">
                  {toEth(userStaked)} SOME
                </span>
              </div>
              <div className="flex">
                <span className="text-14 xl:text-16 leading-42 opacity-60">Status:</span>
                <span className="font-mono text-14 xl:text-16 leading-42 ml-auto">
                  {pool.status}
                  <Progress completed={Math.round(progressBarValue * 100)} />
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div className="flex justify-center">
          <Button text="Lock" invert onClick={onLockClick} />
          <div className="ml-3" />
          <Button text="Withdraw" onClick={onUnlockClick} />
        </div>
      </div>
    </div>
  )
}

export default Pool
