import { CoinGeckoCoin, getCoinsList, getCoinsMarkets } from 'clients/coingecko'
import { Moralis } from 'moralis'
import { ChainId } from 'types/moralis'
import { networkConfigs } from 'utils/networks'

export type GenericTokenBalance = {
  address: string
  image: string
  name: string
  symbol: string
  decimals: number
  amount: number
  price: number
}

export const getUsdBalance = (tokenBalance: GenericTokenBalance): number =>
  Moralis.Units.FromWei(tokenBalance.amount, tokenBalance.decimals) * tokenBalance.price

const getCoinId = (symbol: string, name: string, coins: CoinGeckoCoin[]): string | null => {
  if (!coins) {
    return null
  }

  const coinsBySymbol = coins.filter(coin => coin.symbol.toLowerCase() === symbol.toLowerCase())
  if (coinsBySymbol.length === 1) {
    return coinsBySymbol[0].id
  }

  if (coinsBySymbol.length > 1) {
    const coinsByName = coinsBySymbol.filter(coin => coin.name.toLowerCase() === name.toLowerCase())
    if (coinsByName.length > 0) {
      return coinsByName[0].id
    }
    return coinsBySymbol[0].id
  }
  return null
}

export const getTokenBalances = async (
  address: string,
  chainId: ChainId,
): Promise<GenericTokenBalance[] | null> => {
  const allCoins = await getCoinsList()
  if (!allCoins) {
    return null
  }

  const erc20TokenBalances = await Moralis.Web3API.account.getTokenBalances({
    address,
    chain: chainId,
  })
  const nativeTokenBalance = await Moralis.Web3API.account.getNativeBalance({
    address,
    chain: chainId,
  })
  const currentNetwork = networkConfigs[chainId]
  const coinIds = [
    currentNetwork.coinGeckoId,
    ...erc20TokenBalances.map(token => getCoinId(token.symbol, token.name, allCoins)),
  ].filter(coinId => !!coinId) as string[]

  const coinsMarketData = await getCoinsMarkets(coinIds)

  const nativeTokenMarketData = coinsMarketData?.find(
    coin => coin.id === currentNetwork.coinGeckoId,
  )
  if (!nativeTokenMarketData) {
    return null
  }
  const nativeTokenBalanceWithPrice = {
    address: '',
    image: nativeTokenMarketData.image || 'https://etherscan.io/images/main/empty-token.png',
    name: nativeTokenMarketData.name,
    symbol: nativeTokenMarketData.symbol,
    decimals: currentNetwork.decimals,
    amount: parseFloat(nativeTokenBalance.balance) ?? 0,
    price: nativeTokenMarketData.current_price || 0,
  }

  const erc20BalancesWithPrices = await Promise.all(
    erc20TokenBalances.map(async (token): Promise<GenericTokenBalance> => {
      const tokenPrice = await Moralis.Web3API.token
        .getTokenPrice({
          address: token.token_address,
          chain: chainId as '0x1' | '0x38' | '0x89' |'0xa86a'
        })
        .catch(() => null)

      return {
        address: token.token_address,
        image:
          token.logo ||
          coinsMarketData?.find(coin => coin.symbol.toLowerCase() === token.symbol.toLowerCase())
            ?.image ||
          'https://etherscan.io/images/main/empty-token.png',
        name: token.name,
        symbol: token.symbol,
        decimals: parseFloat(token.decimals),
        amount: parseFloat(token.balance),
        price: tokenPrice?.usdPrice || 0,
      }
    }),
  )

  return [nativeTokenBalanceWithPrice, ...erc20BalancesWithPrices]
}
