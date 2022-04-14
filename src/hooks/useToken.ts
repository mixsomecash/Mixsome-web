import { useEffect, useState } from 'react'
import erc20Abi from 'utils/ERC20.json'
import Moralis from 'moralis'
import { useMoralis } from 'react-moralis'

type TokenDetails = {
  name: string
  symbol: string
}

type Props = {
  address: string
}

export const useToken = ({ address }: Props) => {
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null)
  const { isInitialized } = useMoralis()

  useEffect(() => {
    if (!isInitialized) {
      return
    }
    ;(async () => {
      const metadata = await Moralis.Web3API.token.getTokenMetadata({
        chain: 'bsc',
        addresses: [address],
      })
      const tokenMetadata = metadata[0]
      setTokenDetails({
        name: tokenMetadata.name,
        symbol: tokenMetadata.symbol,
      })
    })()
  }, [address, isInitialized])

  const approve = async (spender: string, amount: number) => {
    await Moralis.executeFunction({
      contractAddress: address,
      functionName: 'approve',
      params: {
        spender,
        amount: Moralis.Units.Token(amount),
      },
      abi: erc20Abi,
    })
  }

  return { tokenDetails, approve }
}
