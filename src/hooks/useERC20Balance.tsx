import { useCallback, useEffect, useState } from 'react'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'

export const useERC20Balance = params => {
  const { account } = useMoralisWeb3Api()
  const { isInitialized, chainId, account: walletAddress } = useMoralis()
  const [assets, setAssets] = useState()

  const fetchERC20Balance = useCallback(async () => {
    return account
      .getTokenBalances({ address: walletAddress, chain: params?.chain || chainId })
      .then(result => result)
  }, [account, chainId, params.chain, walletAddress])

  useEffect(() => {
    if (isInitialized) {
      fetchERC20Balance().then(balance => setAssets(balance))
    }
  }, [isInitialized, chainId, walletAddress, fetchERC20Balance])

  return { fetchERC20Balance, assets }
}

export default useERC20Balance
