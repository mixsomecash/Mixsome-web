import React, { useState, useContext } from 'react'
import classNames from 'classnames'

import { useGetFlowData } from 'hooks'
import { Button, InvestInput, LinkWithArrow, Loader } from 'components'
import { Currency } from 'constants/currency'
import { getCurrencyIconFileName } from 'utils/currencyIcon'
import { AppContext } from 'AppContext'

const DefiShark = () => {
  const { account } = useContext(AppContext)
  const [investValue, setInvestValue] = useState<number | null>(null)

  const { isLoading, depositEth } = useGetFlowData('0x1A31E360bF2C8bAbD1Fe7AB7bA37bF4499249242')

  const handleConfirmTransactionClick = async () => {
    if (!investValue) return

    if (!account) return

    if (account.balance < investValue) {
      alert(`Sorry, but max amount that you can invest is ${account.balance} ETH`)

      return
    }

    depositEth(investValue)
  }

  const handleValueChange = (value: number) => {
    setInvestValue(value)
  }

  const renderLoader = () => {
    return (
      <div className="container mx-auto flex flex-col">
        <div className="m-auto text-center">
          <Loader />
        </div>
      </div>
    )
  }

  const renderInvestControl = () => {
    return (
      <div className="xl:w-1/3">
        <InvestInput onValueChange={handleValueChange} />
      </div>
    )
  }

  const renderArrow = () => {
    return (
      <div className="flex">
        <img
          className="mx-auto py-2 xl:mx-1 xl:px-5 transform rotate-90 xl:rotate-0"
          src="/images/icons/big-arrow.svg"
          alt=""
        />
      </div>
    )
  }

  const renderCurrencyIcon = (currency: Currency, index: number) => {
    const iconUrl = `/images/currencies/${getCurrencyIconFileName(currency)}`

    const className = classNames('w-10', 'h-10', 'xl:w-10', 'xl:h-10', {
      '-ml-3 xl:-ml-5': index > 0,
    })

    return (
      <div key={index} className={className}>
        <img className="w-full h-full" src={iconUrl} alt="" />
      </div>
    )
  }

  const renderCard = ({
    title,
    left,
    center,
    right,
  }: {
    title: string
    left: { icons: Array<Currency> | null; value: number }
    center?: { value: string | number }
    right: { icons: Array<Currency> | null; value: number }
  }) => {
    return (
      <div className="bg-white p-5 xl:p-10 xl:flex-1">
        <div className="pb-5 flex items-center mb-1 xl:mb-4">
          <span className="text-14 leading-28 opacity-60 xl:text-18">{title}</span>
        </div>
        <div className="flex flex-col xl:flex-row">
          <div className="flex items-center xl:flex-col xl:items-center">
            <div className="flex">{left.icons?.map(renderCurrencyIcon)}</div>
            <div className="ml-auto font-mono text-16 leading-21 xl:mt-4 xl:ml-0 xl:text-20 xl:leading-26">
              {left.value.toFixed(2)}
            </div>
          </div>

          <div className="flex my-1 -m-5 xl:mx-3 xl:mt-1 xl:flex-col xl:flex-1">
            <div className="line-background flex-1 xl:flex-initial xl:mt-2">
              <img
                className="transform rotate-90 w-3 h-3 ml-8 pl-1 xl:rotate-0 xl:w-4 xl:h-4 xl:mx-auto xl:mt-0 xl:pl-0"
                src="/images/triangle.svg"
                alt=""
              />
            </div>

            <div className="bg-white xl:mr-0 xl:ml-0 xl:mt-auto text-center">
              {center?.value && (
                <p className="font-mono text-12 leading-16 opacity-60 xl:ml-0 xl:mt-auto text-center xl:text-16 xl:leading-21 min-h-max px-5">
                  {center?.value}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center xl:flex-col xl:items-center">
            <div className="flex">{right.icons?.map(renderCurrencyIcon)}</div>
            <div className="ml-auto font-mono text-16 leading-21 xl:mt-4 xl:ml-0 xl:text-20 xl:leading-26">
              {right.value.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isInvestButtonDisabled = !investValue || investValue < 0

  if (isLoading) return renderLoader()

  return (
    <div className="flex flex-col w-full">
      <div className="w-full xl:px-10 pb-10 xl:flex xl:mt-8">
        <div className="xl:w-2/3 mr-5">
          <div className="mb-10">
            <LinkWithArrow url="/" text="Go back" arrowSide="left" />
          </div>
          <div className="xl:flex">
            <div className="text-20 leading-26 font-sans xl:text-32 xl:leading-42">Defi Shark</div>
            <div className="text-black opacity-40 pt-2 text-14 leading-24 xl:pl-5 xl:text-18 xl:leading-28">
              DeFi flow will be executed in 1 transaction.
            </div>
          </div>
        </div>
        {renderInvestControl()}
      </div>

      <div className="my-5 items-center pb-20 xl:flex">
        {renderCard({
          title: 'Swap ETH to CETH - Compound.',
          left: {
            icons: [Currency.Ether],
            value: investValue || 0,
          },
          center: { value: 0.02 || 0 },
          right: { icons: [Currency.CompoundEth], value: investValue! * 0.02 || 0 },
        })}

        {renderArrow()}

        {renderCard({
          title: 'cTokens Vault APY + SOME reward token',
          left: {
            icons: [Currency.CompoundEth],
            value: investValue! * 0.02 || 0,
          },
          center: { value: 5.01 },
          right: { icons: [Currency.Ether, Currency.Compound], value: investValue! * 1.01 },
        })}

        {renderArrow()}

        {renderCard({
          title: 'Withdraw or Stake APY',
          left: {
            icons: [Currency.Ether, Currency.Compound, Currency.MixsomeCoin],
            value: investValue! * 1.01,
          },
          center: { value: investValue! * 1.1055 || 0 },
          right: { icons: [Currency.Ether], value: investValue! * 1.01 * 1.1055 },
        })}
      </div>

      <div className="flex justify-center pb-10">
        <Button
          text="Confirm transaction"
          disabled={isInvestButtonDisabled}
          onClick={handleConfirmTransactionClick}
        />
      </div>

      <div className="xl:px-10 pb-10 xl:flex flex-wrap justify-center">
        <span className="ml-1">DISCLAIMER:</span>
        <span className="ml-1 opacity-60">
          Use Mixsome at your own risk. We do not provide any warranties or guarantees, and all the
          information in this document doesn’t make us responsible for your decisions.
        </span>
        <a className="ml-1" href="/more">
          Read more
        </a>
      </div>
    </div>
  )
}

export default DefiShark
