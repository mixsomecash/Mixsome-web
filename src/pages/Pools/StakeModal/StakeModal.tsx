import React, { useState, useEffect, useContext } from 'react'
import { useGetApproval, useGetPoolData, useGetApprovalStatus } from 'hooks'
import { Button, Modal, InvestInput } from 'components'
import { useMoralis } from 'react-moralis'
import { AppContext } from 'AppContext'
import { PoolModel } from 'types/models'

type Props = {
  isVisible: boolean
  address: string | null
  crypto: string | null
  onClose: () => void
}

const StakeModal = ({ isVisible, address, crypto, onClose }: Props) => {
  const [isStakeButtonDisabled, setIsStakeButtonDisabled] = useState(true)
  const [investValue, setInvestValue] = useState<number | null>(null)
  const [isLoading, setIsloading] = useState(true)
  const { approvalGet } = useGetApproval(address!, crypto!)
  const { stakeSome } = useGetPoolData(address!)
  const { approvalStatus } = useGetApprovalStatus(crypto!)
  const { account } = useContext(AppContext)

  const handleApproveButtonClick = () => {
    // stakeSome(100)
    // Do something
    approvalGet()

    setIsStakeButtonDisabled(false)
  }

  const handleValueChange = (value: number) => {
    setInvestValue(value)
  }

  const handleStakeButtonClick = async () => {
    // Do something
    if (!investValue) return

    if (!account) return
    // const a = await getSmth()

    // if (a < investValue) {
    //   alert(`Sorry, but max amount that you can invest is ${a} SOME`)

    //   return
    // }
    stakeSome(investValue)

    setIsStakeButtonDisabled(true)
  }

  return (
    <Modal show={isVisible} withCloseButton onClose={onClose}>
      <div className="flex flex-col justify-center items-center ">
        <p className="text-14 xl:text-16 leading-42 opacity-60 mb-5">Mainnet</p>
        <div className="mb-5">
          <InvestInput onValueChange={handleValueChange} />
        </div>
        <div className="flex">
          <Button text="Approve" onClick={handleApproveButtonClick} />
          <div className="ml-3" />
          <Button disabled={isStakeButtonDisabled} text="Stake" onClick={handleStakeButtonClick} />
        </div>
      </div>
    </Modal>
  )
}

export default StakeModal
