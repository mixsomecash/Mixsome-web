import React from 'react'

import { CurrencyIcon, LinkWithArrow, Progress } from 'components'
import { Currency } from 'constants/currency'
import { FlowModel } from 'types/models'

import FlowSummary from './FlowSummary'

const flows: Array<FlowModel> = [
  {
    id: 1,
    name: 'DeFi Shark',
    optimal: true,
    availableCurrencies: [Currency.DAI, Currency.Compound, Currency.CompoundEth],
    apyPtc: 9.02,
    liquidity: '425.02M',
  },
]

const Main = () => {
  const renderFlows = () => {
    if (!flows.length) return null

    return (
      <div className="flex justify-center flex-wrap">
        {flows.map(flow => (
          <FlowSummary key={flow.id} flow={flow} />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="xl:px-10 pb-10 xl:flex xl:mt-8">
        <div>
          <p className="font-medium text-20 leading-26 xl:text-32 xl:leading-42 mb-5">
            Maximize DeFi Flows
          </p>
          <p className="font-regular text-14 leading-24 xl:text-18 xl:leading-28 opacity-60">
            Join thousands of others who are using Mixsome and claim rewards from liquidity pools
            like Launchpool and more.
          </p>
        </div>
      </div>

      {renderFlows()}

      <div className="pt-10 xl:flex xl:pt-20 xl:px-10">
        <div className="flex-1 xl:w-2/3">
          <div className="xl:flex gap-10 xl:pb-8">
            <div className="pb-8 xl:pb-0">
              <div className="pb-5 flex items-center">
                <span className="font-regular text-14 leading-18 xl:text-18 xl:leading-24 opacity-60">
                  Total rewards
                </span>
                <img className="w-4 h-4 ml-1" src="/images/icons/info.svg" alt="" />
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <CurrencyIcon src="/images/currencies/mixsome.png" />
                </div>
                <div className="font-mono text-16 leading-21 xl:text-20 xl:leading-26">
                  250,000.00
                </div>
                <div className="text-16 leading-21 xl:text-20 xl:leading-26 opacity-60 ml-3">
                  SOME
                </div>
              </div>
            </div>
            <div className="pb-2 xl:pb-0">
              <div className="font-regular text-14 leading-18 xl:text-18 xl:leading-24 opacity-60 pb-5">
                Already rewarded this week
              </div>
              <div className="flex items-center">
                <div className="mr-4">
                  <CurrencyIcon src="/images/currencies/mixsome.png" />
                </div>
                <div className="font-mono text-16 leading-21 xl:text-20 xl:leading-26">
                  250,000.00
                </div>
                <div className="text-16 leading-21 xl:text-20 xl:leading-26 opacity-60 ml-3">
                  SOME
                </div>
              </div>
            </div>
          </div>
          <Progress completed={49} />
        </div>
        <div className="xl:w-1/3 xl:pl-20 pt-5 xl:-t-0">
          <div className="font-medium text-20 leading-26 xl:text-32 xl:leading-42">
            Learn more about DeFi
          </div>
          <div className="text-14 leading-24 xl:text-18 xl:leading-28 opacity-40 pt-2 mb-7">
            Collection of resources for learning about Decentralized Finance.
          </div>
          <LinkWithArrow url="/" text="Learn more" arrowSide="right" />
        </div>
      </div>
    </div>
  )
}

export default Main
