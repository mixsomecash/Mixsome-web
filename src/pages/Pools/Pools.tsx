import React from 'react'
import { useMoralis } from 'react-moralis'
import { Currency } from 'constants/currency'
import { LinkWithArrow, ErrorMessage } from 'components'
import Pool from './Pool'
import { PoolInfo } from './Pool/types'

const pools: Array<PoolInfo> = [
  {
    address: '0x75EFCeb7Ba78CF4C795eDa462d111baEBf707faE',
    chainId: '0x1',
    curencies: [Currency.Ether, Currency.MixsomeCoin],
  },
  {
    address: '0xc56fFEFE53CE0fdf80eE7071d250E86d4819f3Dc',
    chainId: '0x38',
    curencies: [Currency.Binance, Currency.MixsomeCoin],
  },
]

const Pools = () => {
  const { isAuthenticated, account } = useMoralis()

  if (!isAuthenticated || !account) {
    return <ErrorMessage message="Please connect to your wallet" />
  }

  return (
    <div className="flex flex-col w-full">
      <div className="w-full xl:px-10 pb-10 xl:flex xl:mt-8">
        <div className="xl:w-2/3 mr-5">
          <div className="mb-10">
            <LinkWithArrow url="/" text="Go back" arrowSide="left" />
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="xl:px-10 pb-10 xl:flex xl:mt-8">
          <div>
            <p className="font-medium text-20 leading-26 xl:text-32 xl:leading-42 mb-5">
              Stake SOME tokens to earn APY
            </p>
          </div>
        </div>
        <div className="flex xl:px-10 flex-wrap">
          {pools.map(pool => (
            <Pool key={pool.address} pool={pool} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Pools
