import { useEffect, useState, useContext, useCallback } from 'react'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'
import { AbiItem } from 'web3-utils'
import tokenContractAbi from 'utils/StakingPool.json'

const useGetTotalStaked = (address: string) => {
  const [isLoading, setIsloading] = useState(true)
  const { user, isAuthenticated, web3, Moralis } = useMoralis()
  const [TotalValue, setTotalValue] = useState<number | null>(null)
  const [progressValue, setProgressValue] = useState(2)

  const getStaked = async () => {
    setIsloading(true)
    const connector = await Moralis.Web3.enable()
    const poolas = new connector.eth.Contract(
      tokenContractAbi as AbiItem[],
      '0xc56fFEFE53CE0fdf80eE7071d250E86d4819f3Dc',
    )
    const tx = await poolas.methods.stakedTotal().call()
    console.log(tx)
    setProgressValue(tx)
    setIsloading(false)
    console.log(progressValue)
  }

  return {
    progressValue,
    getStaked,
  }
}

export default useGetTotalStaked
