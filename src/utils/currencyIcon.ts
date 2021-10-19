import { Currency } from 'constants/currency'

export const getCurrencyIconFileName = (currency: Currency) => {
  switch (currency) {
    case Currency.Binance:
      return 'binance.png'
    case Currency.Ether:
      return 'ether.png'
    case Currency.CompoundEth:
      return 'compound-ether.png'
    case Currency.CompoundDai:
      return 'compound-dai.png'
    case Currency.Compound:
      return 'compound.png'
    case Currency.DAI:
      return 'dai.png'
    case Currency.MixsomeCoin:
      return 'mixsome.png'
    case Currency.Uniswap:
      return 'uniswap.png'
    case Currency.USDC:
      return 'usdc.png'
    case Currency.YCurve:
      return 'ycurve.png'
    case Currency.Launchpool:
      return 'launchpool.png'
    default:
      return null
  }
}
