import React, { useEffect, useState } from 'react'
import { ErrorMessage, Loader, TimeChart } from 'components'
import { useMoralis } from 'react-moralis'
import { MoralisPairAddress, ChainAddress, Exchange } from 'types/moralis'
import { TimeRecord } from 'components/Charts/TimeChart/types'

const CHART_DATES_COUNT = 16

type Props = {
  token0Address: string
  token1Address: string
  exchange: Exchange
  chainId: ChainAddress
}

const Invest = (props: Props) => {
  const { token0Address, token1Address, exchange, chainId } = props
  const { Moralis, isAuthenticated } = useMoralis()
  const [pair, setPair] = useState<MoralisPairAddress | null>(null)
  const [lastReserve, setLastReserve] = useState<number | null>(null)
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
        if (lastReserves) {
          setLastReserve(Number(lastReserves.reserve0) / 10 ** Number(pairData.token0.decimals))
        }
      }
      setIsLoading(false)
    })()
  }, [Moralis.Web3API.defi, token0Address, token1Address, exchange, chainId, isAuthenticated])

  if (!isAuthenticated) {
    return <ErrorMessage message="Please connect to your wallet" />
  }

  const getReserves = async (fromTime: number): Promise<TimeRecord[] | null> => {
    if (!pair) {
      return null
    }
    const currentTime = Date.now()
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
        value: Number(res.reserve0) / 10 ** Number(pair.token0.decimals),
      })) ?? null
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="col-span-2 bg-white px-5 py-3">
        {!isLoading && pair && (
          <div>
            <div className="text-32 pt-2">
              {pair.token0.symbol} / {pair.token1.symbol}
            </div>
            <div className="pb-2">
              {pair.token0.name} / {pair.token1.name}
            </div>
            {lastReserve ? (
              <div className="text-32 text-green font-bold">{lastReserve.toFixed(4)}</div>
            ) : null}
            <TimeChart getData={getReserves} dataLabel={`${pair?.token0.symbol} Reserve`} />
          </div>
        )}
        {isLoading && !pair && (
          <div className="text-center">
            <Loader />
          </div>
        )}
        {!isLoading && !pair && <ErrorMessage message="An error occured while getting pair data" />}
      </div>
    </div>
  )
}

export default Invest
