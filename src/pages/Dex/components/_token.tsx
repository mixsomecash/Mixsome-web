import React, { useEffect, useState } from 'react'
import { useMoralis, useTokenPrice } from 'react-moralis'
import Select from 'react-select'
import { Card, Modal } from 'antd'

import { DexToken } from '../../../types/models/dex'
import { nativeAddress } from '../services/constants'
import { isNative, getWrappedNative } from '../services/utils'
import { Input } from './_input'
import { SelectButton } from './_select-button'
import { USDPrice } from './_usd-price'

interface SetAmount {
  (amount: number | string): void
}

interface SetToken {
  (token: DexToken): void
}

interface SetUSDPrice {
  (usdPrice: number | undefined): void
}

interface TokenInterface {
  direction: string
  amount: number | string
  setAmount: SetAmount
  token: DexToken
  setToken: SetToken
  tokenList: DexToken[]
  usdPrice: number | undefined
  setUSDPrice: SetUSDPrice
  path: string
}

export const Token: React.FC<TokenInterface> = (props: TokenInterface) => {
  const {
    direction,
    amount,
    setAmount,
    token,
    setToken,
    tokenList,
    usdPrice,
    setUSDPrice,
    path,
  } = props

  const { isInitialized } = useMoralis()

  const { fetchTokenPrice } = useTokenPrice({
    address: token?.address,
    chain: path === 'eth' ? 'eth' : 'bsc',
  })

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const handleChange = selectedToken => {
    setToken(selectedToken)
    setModalOpen(false)
  }

  useEffect(() => {
    if (direction === 'From') {
      tokenList.map(
        currentToken => currentToken.address === nativeAddress && setToken(currentToken),
      )
    }
  }, [direction, setToken, tokenList])

  useEffect(() => {
    if (!isInitialized || !token.name || !amount || !path) return undefined

    const validationChain = path === 'eth' ? '0x1' : '0x38'

    const tokenAddress = isNative(token.address) ? getWrappedNative(validationChain) : token.address

    fetchTokenPrice({
      params: { chain: validationChain, address: tokenAddress },
      onSuccess: price => {
        setUSDPrice(price?.usdPrice)
      },
      onError: error => console.log(error),
    })

    return undefined
  }, [amount, fetchTokenPrice, isInitialized, path, setUSDPrice, token])

  interface OptionProps {
    data: any
  }

  const Option: React.FC<OptionProps> = (optionProps: OptionProps) => {
    const { data } = optionProps

    const handleClick = event => {
      event.preventDefault()
      handleChange(data)
    }

    return (
      <a
        href="#"
        style={{
          display: 'flex',
          margin: '6px',
          cursor: 'pointer',
          alignItems: 'center',
        }}
        onClick={handleClick}
      >
        <img
          style={{ width: '30px', height: '30px', marginRight: '16px' }}
          src={data.logoURI}
          alt={data.label}
        />
        {data.label}
      </a>
    )
  }

  return (
    <Card>
      <div>
        {direction}: <span style={{ fontWeight: 'bold' }}>{token.name || 'Select token'}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'nowrap', justifyContent: 'space-around' }}>
        <Input
          decimals={token.decimals}
          direction={direction}
          value={amount}
          setValue={setAmount}
        />
        <SelectButton setModalOpen={setModalOpen} token={token} />
      </div>
      {usdPrice && <USDPrice usdPrice={usdPrice} />}
      <Modal
        title="Select a token"
        visible={modalOpen}
        onCancel={() => setModalOpen(false)}
        bodyStyle={{ padding: 0 }}
        width="450px"
        footer={null}
      >
        <div style={{ overflow: 'auto', height: '346px' }}>
          <Select
            value={token}
            options={tokenList}
            components={{ Option }}
            onChange={handleChange}
            placeholder="Start typing for a search.."
            menuIsOpen
            styles={{
              menu: (provided, state) => ({ ...provided, paddingLeft: '12px' }),
              control: () => ({
                display: 'flex',
                justifyContent: 'space-between',
                paddingLeft: '12px',
              }),
            }}
          />
        </div>
      </Modal>
    </Card>
  )
}
