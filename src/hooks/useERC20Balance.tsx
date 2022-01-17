import { useEffect, useState } from 'react'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'

// For api mockup..
// const ASSETS = [
//   {
//     balance: '7862649746537465',
//     decimals: 18,
//     logo: null,
//     name: 'Ethereum',
//     symbol: 'ETH',
//     token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
//   },
//   {
//     balance: '4253678940536074',
//     decimals: 18,
//     logo: null,
//     name: 'Bitcoin',
//     symbol: 'BTC',
//     token_address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
//   },
// ]

export const useERC20Balance = () => {
  const { account } = useMoralisWeb3Api()
  const { isInitialized, account: walletAddress } = useMoralis()
  // TODO: Need to find out the asset type here..
  const [assets, setAssets] = useState<any>()

  useEffect(() => {
    const fetchBalance = async (address: string) =>
      account.getTokenBalances({ address }).then(result => setAssets(result))
    if (isInitialized && walletAddress) fetchBalance(walletAddress)
  }, [account, isInitialized, walletAddress])

  return { assets }

  // return { assets: ASSETS }
}

export default useERC20Balance
