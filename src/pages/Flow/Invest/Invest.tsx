import React from 'react'
import { TimeChart } from 'components'
import { useMoralis } from 'react-moralis'

const Invest = () => {
  const { Moralis } = useMoralis()

  const getReserves = async (fromTime: number): Promise<any> => {
    const currentTime = Date.now()
    const DATE_INTERVALS_COUNT = 32
    const dates = Array.from(
      new Array(DATE_INTERVALS_COUNT),
      (_, i) => currentTime - (currentTime - fromTime) * (i / DATE_INTERVALS_COUNT),
    )
      .map(timestamp => new Date(timestamp).toUTCString())
      .reverse()
    const reserves = await Promise.all(
      dates.map(time =>
        Moralis.Web3API.defi.getPairReserves({
          pair_address: '0xa527a61703d82139f8a06bc30097cc9caa2df5a6',
          chain: '0x38',
          to_date: `${time}`,
        }),
      ),
    )
    return reserves?.map((reserve, i) => ({ date: dates[i], value: reserve.reserve0 }))
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="col-span-2 bg-white px-5 py-3">
        <TimeChart getData={getReserves} dataLabel="Reserve" />
      </div>
    </div>
  )
}

export default Invest
