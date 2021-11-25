import React, { useState, useEffect, useMemo } from 'react'
import { useMoralis } from 'react-moralis'
import { Button, Card, InputNumber, Image, Modal } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons'

import type { DexToken, CurrentTrade } from '../../../types/models/dex'
import { nativeAddress } from '../services/constants'

import { ModalContent } from './modal-content'

interface CardComponentProps {
  chain: string
  tokenList: DexToken[]
}

export type HandleModal = {
  open: boolean
  direction: string
}

const Arrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="2"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <polyline points="6 9 12 15 18 9" />
  </svg>
)

export const CardComponent: React.FC<CardComponentProps> = (props: CardComponentProps) => {
  const { chain, tokenList } = props

  const { Moralis } = useMoralis()

  const [tokenDirection, setTokenDirection] = useState<string>('')

  const [fromAmount, setFromAmount] = useState<string | undefined>(undefined)

  const [toAmount, setToAmount] = useState<string>('')

  const [fromToken, setFromToken] = useState<DexToken | null>(null)

  const [toToken, setToToken] = useState<DexToken | null>(null)

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const [currentTrade, setCurrentTrade] = useState<CurrentTrade | null>(null)

  const handleFromAmount = (value: string): void => setFromAmount(value)

  const handleToAmount = (value: string): void => setToAmount(value)

  const handleModal = (value: HandleModal): void => {
    const { open, direction } = value
    setTokenDirection(direction)
    setModalOpen(open)
  }

  const setToken = (value: DexToken): void => {
    if (tokenDirection === 'from') setFromToken(value)
    if (tokenDirection === 'to') setToToken(value)
  }

  const ButtonState = useMemo(() => {
    if (fromAmount && !fromToken) {
      return { isActive: false, text: 'Select a token' }
    }
    if (fromToken && !fromAmount) {
      return { isActive: false, text: 'Enter an amount' }
    }
    if (fromAmount && fromToken) {
      return { isActive: false, text: 'Select a token' }
    }
    return { isActive: false, text: 'Enter an amount' }
  }, [fromAmount, fromToken])

  useEffect(() => {
    if (!tokenList) return undefined
    tokenList.map(token => {
      if (token.address === nativeAddress) setFromToken(token)
      return token.address === nativeAddress ? token : null
    })
    return undefined
  }, [tokenList])

  useEffect(() => {
    if (fromToken && toToken && fromAmount) {
      // const fromTokenRaw = {
      //   address: fromToken.address,
      //   decimals: fromToken.decimals,
      //   logoURI: fromToken.logoURI,
      //   name: fromToken.name,
      //   symbol: fromToken.symbol,
      // }

      // const toTokenRaw = {
      //   address: toToken.address,
      //   decimals: toToken.decimals,
      //   logoURI: toToken.logoURI,
      //   name: toToken.name,
      //   symbol: toToken.symbol,
      // }

      setCurrentTrade({
        chain,
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: parseFloat(fromAmount),
      })
    }
  }, [chain, fromToken, toToken, fromAmount])

  useEffect(() => {
    const getQuote = () => {
      if (!Moralis?.Plugins?.oneInch) return undefined
      Moralis.Plugins.oneInch.quote(currentTrade).then(quote => {
        console.log(quote.data)
      })
      return undefined
    }

    getQuote()
  }, [Moralis.Plugins, currentTrade])

  return (
    <>
      <Card
        style={{
          width: '430px',
          boxShadow: '0 0.5rem 1.2rem rgb(189 197 209 / 20%)',
          border: '1px solid #e7eaf3',
          borderRadius: '1rem',
          fontSize: '16px',
          fontWeight: 'normal',
        }}
        bodyStyle={{ padding: '18px' }}
      >
        <Card style={{ borderRadius: '1rem' }} bodyStyle={{ padding: '0.8rem' }}>
          <div
            style={{ marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#434343' }}
          >
            From
          </div>
          <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <div>
              <InputNumber
                value={fromAmount}
                onChange={handleFromAmount}
                bordered={false}
                placeholder="0.00"
                style={{
                  padding: '0',
                  marginLeft: '-10px',
                  fontWeight: 'normal',
                  fontSize: '23px',
                  display: 'block',
                  width: '100%',
                }}
              />
            </div>
            <Button
              onClick={() => handleModal({ open: true, direction: 'from' })}
              style={{
                height: 'fit-content',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '0.6rem',
                padding: '5px 10px',
                fontWeight: 'bold',
                fontSize: '17px',
                gap: '7px',
                border: 'none',
              }}
            >
              {fromToken ? (
                <Image
                  src={fromToken?.logoURI || 'https://etherscan.io/images/main/empty-token.png'}
                  alt={fromToken.logoURI ? fromToken.name : 'no logo'}
                  width="30px"
                  preview={false}
                  style={{ borderRadius: '15px' }}
                />
              ) : (
                <span>Select a token</span>
              )}
              <span>{fromToken?.symbol}</span>
              <Arrow />
            </Button>
          </div>
        </Card>

        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
          <ArrowDownOutlined />
        </div>

        <Card style={{ borderRadius: '1rem' }} bodyStyle={{ padding: '0.8rem' }}>
          <div
            style={{ marginBottom: '5px', fontSize: '14px', fontWeight: 'bold', color: '#434343' }}
          >
            To
          </div>
          <div style={{ display: 'flex', flexFlow: 'row nowrap' }}>
            <div>
              <InputNumber
                readOnly
                value={toAmount}
                onChange={handleToAmount}
                bordered={false}
                placeholder="0.00"
                style={{
                  padding: '0',
                  marginLeft: '-10px',
                  fontWeight: 'normal',
                  fontSize: '23px',
                  display: 'block',
                  width: '100%',
                }}
              />
            </div>
            <Button
              onClick={() => handleModal({ open: true, direction: 'to' })}
              style={{
                height: 'fit-content',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '0.6rem',
                padding: '5px 10px',
                fontWeight: 'bold',
                fontSize: '17px',
                gap: '7px',
                border: 'none',
              }}
              type={toToken ? 'default' : 'primary'}
            >
              {toToken ? (
                <Image
                  src={toToken?.logoURI || 'https://etherscan.io/images/main/empty-token.png'}
                  alt={toToken?.logoURI ? toToken.name : 'no logo'}
                  width="30px"
                  preview={false}
                  style={{ borderRadius: '15px' }}
                />
              ) : (
                <span>Select a token</span>
              )}
              <span>{toToken?.symbol}</span>
              <Arrow />
            </Button>
          </div>
        </Card>

        <Button
          type="primary"
          size="large"
          style={{
            width: '100%',
            marginTop: '15px',
            borderRadius: '0.6rem',
            height: '50px',
          }}
          onClick={() => console.log('Save changess!!')}
          disabled={!ButtonState.isActive}
        >
          {ButtonState.text}
        </Button>
      </Card>

      <Modal
        title="Select a token"
        visible={modalOpen}
        onCancel={() => handleModal({ open: false, direction: 'from' })}
        bodyStyle={{ padding: 0 }}
        width="450px"
        footer={null}
      >
        <ModalContent
          open={modalOpen}
          onClose={handleModal}
          setToken={setToken}
          tokenList={tokenList}
        />
      </Modal>
    </>
  )
}
