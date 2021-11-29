import { CoinGeckoCoin } from 'hooks/useCoinGecko'

export type GenericTokenBalance = {
  image: string
  name: string
  symbol: string
  decimals: number
  balance: number
  price: number
}

const getTokenSymbol = token => token.symbol.toLowerCase()

export const tokenBalancesToGenericBalances = (
  tokenBalances,
  coinsData: CoinGeckoCoin[],
): GenericTokenBalance[] | null => {
  return tokenBalances.map(
    (tokenBalance): GenericTokenBalance => {
      const tokenSymbol = getTokenSymbol(tokenBalance)
      const coinData = coinsData.find(coin => tokenSymbol === coin.symbol)

      return {
        image: coinData?.image || 'https://etherscan.io/images/main/empty-token.png',
        name: tokenBalance.name,
        symbol: tokenBalance.symbol,
        decimals: tokenBalance.decimals,
        balance: tokenBalance.balance,
        price: coinData?.current_price || 0,
      }
    },
  )
}

export const nativeTokenBalanceToGenericBalance = (
  nativeToken,
  nativeTokenBalance,
  coinsData: CoinGeckoCoin[],
): GenericTokenBalance | null => {
  const tokenSymbol = getTokenSymbol(nativeToken)
  const coinData = coinsData.find(coin => tokenSymbol === coin.symbol)

  return {
    image: coinData?.image || 'https://etherscan.io/images/main/empty-token.png',
    name: nativeToken.name,
    symbol: nativeToken.symbol,
    decimals: nativeToken.decimals,
    balance: nativeTokenBalance,
    price: coinData?.current_price || 0,
  }
}
