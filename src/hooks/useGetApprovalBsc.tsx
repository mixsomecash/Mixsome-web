import { useEffect, useState, useContext } from 'react'

import { getContract, getSigner, toEth } from 'clients/ethereum'
import { BigNumber, Contract, ethers } from 'ethers'
import { AppContext } from 'AppContext'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'
import { AbiItem } from 'web3-utils'
import tokenContractAbi from 'utils/ERC20.json'

const useGetApproval = (address: string) => {
  const { account } = useContext(AppContext)
  const [contract, setContract] = useState<Contract | null>(null)
  const [isLoading, setIsloading] = useState(true)
  const [underlyingEthBalance, setUnderlyingEthBalance] = useState(0)
  const [underlyingBalance, setUnderlyingBalance] = useState(0)
  const { user, isAuthenticated, web3, Moralis } = useMoralis()

  useEffect(() => {
    const get = async () => {
      setIsloading(true)
      const wallet = await getContract(address)

      if (!wallet) {
        setIsloading(false)

        return
      }

      setContract(wallet)
      setIsloading(false)
    }

    if (!account) {
      setIsloading(false)

      return
    }

    get()
  }, [address, account])

  const approvalGet = async () => {
    setIsloading(true)
    const connector = await Moralis.Web3.enable()
    const senderAddress = user.get('ethAddress')
    const dex1 = web3.utils.toChecksumAddress(senderAddress)
    const pool = new connector.eth.Contract(tokenContractAbi as AbiItem[], address)
    // const value1 = ethers.utils.parseUnits(amount.toString(), 18)
    const tx = await pool.methods
      .approve(
        '0x6E289c6b08A811b49De5349a382E0da32a66C423',
        '1157920892373161954235709850086879078',
      )
      .send({ from: dex1 })
    await tx.wait
    setIsloading(false)
  }

  return {
    isLoading,
    approvalGet,
  }
}

export default useGetApproval
