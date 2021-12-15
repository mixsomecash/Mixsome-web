import { Moralis } from 'moralis'
import { ChainId, MoralisToken } from 'types/moralis'
import { InvestToken } from './types'

export const getInvestToken = async (
  token: MoralisToken,
  reserve: string,
  chainId: ChainId,
): Promise<InvestToken> => {
  const price = await Moralis.Web3API.token.getTokenPrice({
    address: token.address,
    chain: chainId,
  })
  return {
    ...token,
    decimals: parseFloat(token.decimals),
    reserve: Moralis.Units.FromWei(reserve, parseFloat(token.decimals)),
    price: price.usdPrice,
  }
}
