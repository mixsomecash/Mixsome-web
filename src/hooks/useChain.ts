import { useContext } from 'react'
import { networkConfigs } from 'utils/networks'
import { AppContext } from 'AppContext'

const CURRENCY_DECIMALS = 18
const CHAIN_DOES_NOT_EXIST_ERROR_CODE = 4902

const useChain = () => {
  const app = useContext(AppContext)

  const switchNetwork = async (chainId: string) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      })
    } catch (switchError: any) {
      if (switchError.code === CHAIN_DOES_NOT_EXIST_ERROR_CODE) {
        try {
          const config = networkConfigs[chainId]
          const { chainName, currencyName, currencySymbol, rpcUrl, blockExplorerUrl } = config
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
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
  }

  return { switchNetwork }
}

export default useChain
