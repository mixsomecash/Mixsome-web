import { networkConfigs } from 'utils/networks'
import { useMoralis } from 'react-moralis'

const CHAIN_DOES_NOT_EXIST_ERROR_CODE = 4902

const useChain = () => {
  const { Moralis, isWeb3Enabled } = useMoralis()
  const switchNetwork = async (chainIdString: string) => {
    try {
      if (!isWeb3Enabled) {
        await Moralis.Web3.enableWeb3()
      }
      await Moralis.Web3.switchNetwork(chainIdString)
      window.location.reload()
    } catch (switchError: any) {
      if (switchError.code === CHAIN_DOES_NOT_EXIST_ERROR_CODE) {
        try {
          const config = networkConfigs[chainIdString]
          const {
            chainId,
            chainName,
            currencyName,
            currencySymbol,
            rpcUrl,
            blockExplorerUrl,
          } = config
          await Moralis.Web3.addNetwork(
            chainId,
            chainName,
            currencyName,
            currencySymbol,
            rpcUrl,
            blockExplorerUrl,
          )
          window.location.reload()
        } catch (addError: any) {
          alert(addError.message)
        }
      }
    }
  }

  return { switchNetwork }
}

export default useChain
