import React, { useState, useEffect } from 'react'
import { Button, Modal, InvestInput, Loader } from 'components'
import { useMoralis } from 'react-moralis'
import { PoolContractData, PoolInfo } from './types'
import { approveTokens, stakeTokens, checkAllowance } from './PoolHelper'

type Props = {
  isVisible: boolean
  pool: PoolInfo
  poolContractData: PoolContractData
  onClose: () => void
}

const StakeModal = ({ isVisible, pool, poolContractData, onClose }: Props) => {
  const { account, chainId } = useMoralis()
  const [isApproved, setIsApproved] = useState(false)
  const [investValue, setInvestValue] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (!poolContractData || !account || chainId !== pool.chainId) {
        return
      }
      setIsLoading(true)
      const isAllowance = await checkAllowance(pool, poolContractData.token, account)
      setIsApproved(isAllowance)
      setIsLoading(false)
    })()
  }, [account, chainId, pool, poolContractData])

  const handleApproveButtonClick = async () => {
    if (!account || !poolContractData) {
      return
    }
    setIsLoading(true)
    const result = await approveTokens(pool, poolContractData.token, account)
    setIsLoading(false)
    if (result) {
      setIsApproved(true)
    } else {
      alert('Failed to Approve')
    }
  }

  const handleStakeButtonClick = async () => {
    if (!account) {
      return
    }
    if (!investValue || investValue <= 0) {
      alert('Invalid token amount value')
      return
    }
    setIsLoading(true)
    const result = await stakeTokens(pool, poolContractData, investValue, account)
    setIsLoading(false)
    if (result) {
      onClose()
    } else {
      alert('Failed to Stake')
    }
  }

  const handleValueChange = (value: number) => {
    setInvestValue(value)
  }

  return (
    <Modal show={isVisible} withCloseButton onClose={onClose}>
      <div className="flex flex-col justify-center items-center ">
        <div className="text-24 mb-5">Stake {poolContractData.token.name}</div>
        <div className="mb-5">
          <InvestInput
            disabled={isLoading}
            onValueChange={handleValueChange}
            symbol={poolContractData.token.symbol}
          />
        </div>
        <div className="flex">
          {isLoading && <Loader />}
          {!isLoading && (
            <>
              <Button disabled={isApproved} text="Approve" onClick={handleApproveButtonClick} />
              <div className="ml-3" />
              <Button disabled={!isApproved} text="Stake" onClick={handleStakeButtonClick} />
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default StakeModal
