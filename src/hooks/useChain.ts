import { useMoralis } from 'react-moralis'
import { networkConfigs } from 'utils/networks'

const CURRENCY_DECIMALS = 18
const CHAIN_DOES_NOT_EXIST_ERROR_CODE = 4902

const useChain = () => {
  const { web3, isWeb3Enabled, enableWeb3 } = useMoralis()
  const switchNetwork = async (chain: string) => {
    if (isWeb3Enabled) {
      try {
        await web3.currentProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chain }],
        })
      } catch (switchError: any) {
        if (switchError.code === CHAIN_DOES_NOT_EXIST_ERROR_CODE) {
          try {
            const config = networkConfigs[chain]
            const { chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl } = config
            await web3.currentProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: chain,
                  chainName,
                  nativeCurrency: {
                    name: currencyName,
                    symbol: currencySymbol,
                    decimals: CURRENCY_DECIMALS,
                  },
                  rpcUrls: [rpcUrl],
                  blockExplorerUrls: [blockExplorerUrl],
                },
              ],
            })
          } catch (addError: any) {
            alert(addError.message)
          }
        }
      }
    } else {
      enableWeb3()
    }
  }
  return { switchNetwork }
}

export default useChain
