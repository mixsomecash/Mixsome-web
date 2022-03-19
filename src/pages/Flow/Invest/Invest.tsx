import React, { useEffect, useState } from 'react'
import { ErrorMessage, Loader, TimeChart, TokenTransaction } from 'components'
import { useMoralis } from 'react-moralis'
import { MoralisPair, ChainId, Exchange } from 'types/moralis'
import { TimeRecord } from 'components/Charts/TimeChart/types'
import TokenList from './TokenList'
import { getInvestToken } from './InvestHelper'
import { InvestToken } from './types'

const CHART_DATES_COUNT = 16
const CHART_LAST_VALUE_AGE_SECONDS = 60

type Props = {
  token0Address: string
  token1Address: string
  exchange: Exchange
  chainId: ChainId
  description: string
}

const Invest = (props: Props) => {
  const { token0Address, token1Address, exchange, chainId, description } = props
  const { Moralis, isAuthenticated } = useMoralis()
  const [pair, setPair] = useState<MoralisPair | null>(null)
  const [tokens, setTokens] = useState<InvestToken[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    ;(async () => {
      setIsLoading(true)
      const pairData = (await Moralis.Web3API.defi
        .getPairAddress({
          token0_address: token0Address,
          token1_address: token1Address,
          exchange,
          chain: chainId,
        })
        .catch(() => null)) as any
      if (pairData) {
        setPair(pairData)
        const lastReserves = await Moralis.Web3API.defi.getPairReserves({
          pair_address: pairData.pairAddress,
          chain: chainId,
        })
        const token0 = await getInvestToken(pairData.token0, lastReserves.reserve0, chainId)
        const token1 = await getInvestToken(pairData.token1, lastReserves.reserve1, chainId)
        setTokens([token0, token1])
      }
      setIsLoading(false)
    })()
  }, [Moralis, token0Address, token1Address, exchange, chainId, isAuthenticated])

  if (!isAuthenticated) {
    return <ErrorMessage message="Please connect to your wallet" />
  }

  const getReserves = async (fromTime: number): Promise<TimeRecord[] | null> => {
    if (!pair) {
      return null
    }
    const currentTime = Date.now() - CHART_LAST_VALUE_AGE_SECONDS * 1000
    const dates = Array.from(
      new Array(CHART_DATES_COUNT),
      (_, i) => currentTime - (currentTime - fromTime) * (i / CHART_DATES_COUNT),
    )
      .map(timestamp => new Date(timestamp).toUTCString())
      .reverse()
    const reserves = await Promise.all(
      dates.map(time =>
        Moralis.Web3API.defi.getPairReserves({
          pair_address: pair.pairAddress,
          chain: chainId,
          to_date: `${time}`,
        }),
      ),
    ).catch(() => null)
    return (
      reserves?.map((res, i) => ({
        date: dates[i],
        value: Moralis.Units.FromWei(res.reserve0, parseFloat(pair.token0.decimals)),
      })) ?? null
    )
  }

  return (
    <div>
      {!isLoading && tokens && pair && (
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="col-span-2 mx-1 my-1">
            <div className="bg-white px-5 py-3">
              <div className="text-32 pt-2">
                {tokens[0].symbol} / {tokens[1].symbol}
              </div>
              <div className="pb-2">
                {tokens[0].name} / {tokens[1].name}
              </div>
              <div className="text-32 text-green font-bold">{tokens[0].reserve.toFixed(4)}</div>
              <TimeChart getData={getReserves} dataLabel={`${pair?.token0.symbol} Reserve`} />
            </div>
          </div>
          <div className="col-span-1 mx-1 my-1">
            <div className="bg-white px-5 py-1">
              <TokenTransaction pair={pair} />
            </div>
          </div>
          <div className="col-span-2 mx-1 my-1">
            <div className="bg-white px-5 py-3">
              <div className="text-24 pt-2">Tokens</div>
              <TokenList tokens={tokens} />
            </div>
          </div>
          <div className="col-span-1 mx-1 my-1">
            <div className="bg-white px-5 py-3">
              <div className="text-24 py-2">Description</div>
              <p>{description}</p>
            </div>
          </div>
        </div>
      )}
      {isLoading && !pair && (
        <div className="text-center">
          <Loader />
        </div>
      )}
      {!isLoading && !pair && <ErrorMessage message="An error occured while getting pair data" />}
    </div>
  )
}

export default Invest
