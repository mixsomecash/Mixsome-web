import { useEffect, useState, useContext } from 'react'

import { getContract, getSigner, toEth } from 'clients/ethereum'
import { BigNumber, Contract, ethers } from 'ethers'
import { AppContext } from 'AppContext'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'
import { AbiItem } from 'web3-utils'
import tokenContractAbi from 'utils/ERC20.json'

const useGetApprovalStatus = (address: string) => {
  const { account } = useContext(AppContext)
  const [contract, setContract] = useState<Contract | null>(null)
  const [isLoading, setIsloading] = useState(true)
  const [underlyingEthBalance, setUnderlyingEthBalance] = useState(0)
  const [underlyingBalance, setUnderlyingBalance] = useState(0)
  const { user, isAuthenticated, web3, Moralis } = useMoralis()

  const approvalStatus = async () => {
    setIsloading(true)
    const connector = await Moralis.Web3.enable()
    const senderAddress = user.get('ethAddress')
    // Object.getOwnPropertyNames(balances).forEach(key => {
    //  const value = balances[key]
    //  console.log(balances[key].name)
    // })
    const dex1 = web3.utils.toChecksumAddress(senderAddress)
    const pool = new connector.eth.Contract(tokenContractAbi as AbiItem[], address)
    // const value1 = ethers.utils.parseUnits(amount.toString(), 18)
    const tx = await pool.methods
      .allowance(dex1, '0x75EFCeb7Ba78CF4C795eDa462d111baEBf707faE')
      .call()
      .then(function (result) {
        return { result }
      })
    setIsloading(false)
    console.log(approvalStatus)
  }

  return {
    isLoading,
    approvalStatus,
  }
}

export default useGetApprovalStatus
