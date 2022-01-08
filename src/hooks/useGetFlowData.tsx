/* eslint-disable no-console */
import { useEffect, useState, useContext } from 'react'
import { useMoralis } from 'react-moralis'
import { getContract, toEth } from 'clients/ethereum'
import { BigNumber, Contract, ethers } from 'ethers'
import { AppContext } from 'AppContext'
import { AbiItem } from 'web3-utils'
import tokenContractAbi from 'utils/Wallet.json'

const useGetFlowData = (address: string) => {
  const { account } = useContext(AppContext)
  const [contract, setContract] = useState<Contract | null>(null)
  const [isLoading, setIsloading] = useState(true)
  const [underlyingEthBalance, setUnderlyingEthBalance] = useState(0)
  const [underlyingBalance, setUnderlyingBalance] = useState(0)
  const { user, web3, Moralis } = useMoralis()

  useEffect(() => {
    const get = async () => {
      setIsloading(true)
      const wallet = await getContract(address)

      if (!wallet) {
        setIsloading(false)

        return
      }

      const ethBalance = (await wallet.callStatic.balanceOfUnderlying()) as BigNumber
      const balance = (await wallet.callStatic.estimateBalanceOfUnderlying()) as BigNumber

      setContract(wallet)
      setUnderlyingEthBalance(toEth(ethBalance.toString()))
      setUnderlyingBalance(toEth(balance.toString()))
      setIsloading(false)
    }

    if (!account) {
      setIsloading(false)

      return
    }

    get()
  }, [address, account])

  const depositEth = async (amount: number) => {
    if (!contract) return

    setIsloading(true)
    const web4 = await Moralis.Web3.enable()
    const chainIdDec = await web4.eth.getChainId()
    console.log(chainIdDec)
    const dex = user?.get('ethAddress')
    const dex1 = web3?.utils.toChecksumAddress(dex)
    const contract1 = new web4.eth.Contract(tokenContractAbi as AbiItem[], address)
    const value1 = ethers.utils.parseUnits(amount.toString(), 18)
    const tx = await contract1.methods.deposit(dex1, value1).send({ from: dex1, value: value1 })
    await tx.wait()

    setIsloading(false)
  }

  return {
    underlyingEthBalance,
    underlyingBalance,
    isLoading,
    depositEth,
  }
}

export default useGetFlowData
