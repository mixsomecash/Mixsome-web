import { useEffect, useState, useContext } from 'react'

import { getContract, getSigner, toEth } from 'clients/ethereum'
import { BigNumber, Contract, ethers } from 'ethers'
import { AppContext } from 'AppContext'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'
import { AbiItem } from 'web3-utils'
import tokenContractAbi from 'utils/StakingPool.json'

const useGetPoolData = (address: string) => {
  const { account } = useContext(AppContext)
  const [contract, setContract] = useState<Contract | null>(null)
  const [isLoading, setIsloading] = useState(true)
  const [underlyingEthBalance, setUnderlyingEthBalance] = useState(0)
  const [underlyingBalance, setUnderlyingBalance] = useState(0)
  const [isAddress, setAddress] = useState('')
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

  const stakeSome = async (amount: number) => {
    // if (!contract) return
    setIsloading(true)
    const dex = user.get('ethAddress')
    const dex1 = web3.utils.toChecksumAddress(dex)
    console.log(dex1)
    const connector = await Moralis.Web3.enable()
    const pool = new connector.eth.Contract(tokenContractAbi as AbiItem[], address)
    const value1 = ethers.utils.parseUnits(amount.toString(), 18)
    const tx = await pool.methods.stake(value1).send({ from: dex1 })
    await tx.wait

    setIsloading(false)
  }

  const getAddress = async () => {
    const dex = user.get('ethAddress')
    const dex1 = web3.utils.toChecksumAddress(dex)
    console.log(dex1)
    setAddress(dex1)
  }

  return {
    isLoading,
    stakeSome,
    getAddress,
    isAddress,
  }
}

export default useGetPoolData
