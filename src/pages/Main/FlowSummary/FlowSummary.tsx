import React from 'react'
import { Link } from 'react-router-dom'

import { FlowModel } from 'types/models'
import { Currency } from 'constants/currency'
import { Badge, CurrencyIcon } from 'components'
import { getCurrencyIconFileName } from 'utils/currencyIcon'

type Props = { flow: FlowModel }

const FlowSummary = ({ flow }: Props) => {
  const renderBadge = () => {
    if (!flow.optimal) return null

    return <Badge text="Optimal" />
  }

  const { id, name, apyPtc, liquidity, availableCurrencies } = flow

  const renderTitle = () => {
    return (
      <div className="flex flex-1 items-center">
        <div className="font-medium text-20 leading-26 xl:text-32 xl:leading-42">{name}</div>
        <div className="pl-1 xl:pl-2">{renderBadge()}</div>
      </div>
    )
  }

  const renderLine = (title: string, value: number | string) => {
    return (
      <div className="flex mb-5 xl:mb-7">
        <div className="flex-1 text-14 leading-18 xl:text-18 xl:leading-24 opacity-60">{title}</div>
        <div className="font-mono text-16 leading-22 xl:text-20 xl:leading-26">{value}</div>
      </div>
    )
  }

  const renderSelect = () => {
    return (
      <div className="flex">
        <span className="text-base font-bold text-12 leading-16 xl:text-16 xl:leading-21">
          Select
        </span>
        <img className="flow__select-pointer" src="/images/icons/arrow.svg" alt="" />
      </div>
    )
  }

  const renderIcon = (currency: Currency, index: number) => {
    const iconUrl = `/images/currencies/${getCurrencyIconFileName(currency)}`

    return <CurrencyIcon key={index} src={iconUrl} />
  }

  const renderIcons = () => {
    if (!availableCurrencies) return null

    return <div className="flex flow-icons__container">{availableCurrencies.map(renderIcon)}</div>
  }

  const url = `/flows/${id}`

  return (
    <Link className="flow__container bg-white w-full xl:max-w-max select-none mb-5 xl:m-5" to={url}>
      <div className="flex p-5 xl:p-10">
        {renderTitle()}
        {renderIcons()}
      </div>
      <div className="border-b opacity-10" />
      <div className="p-5 xl:p-10">
        {renderLine('APY', `${apyPtc}%`)}
        {renderLine('Liquidity', liquidity)}
        {renderSelect()}
      </div>
    </Link>
  )
}

export default FlowSummary
