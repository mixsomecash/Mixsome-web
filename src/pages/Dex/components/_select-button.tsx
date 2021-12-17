import React from 'react'
import { Button, Image } from 'antd'

import { DexToken } from '../../../types/models/dex'

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

interface SetModalOpen {
  (modalOpen: boolean): void
}

interface ButtonProps {
  setModalOpen: SetModalOpen
  token: DexToken
}

export const SelectButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  const { setModalOpen, token } = props

  return (
    <Button
      onClick={() => setModalOpen(true)}
      type="primary"
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
        marginLeft: '10px',
      }}
    >
      {token.name ? (
        <Image
          src={token?.logoURI || 'https://etherscan.io/images/main/empty-token.png'}
          alt={token?.logoURI ? token.name : 'no logo'}
          width="30px"
          preview={false}
          style={{ borderRadius: '15px' }}
        />
      ) : (
        <span>Select a token</span>
      )}
      <span>{token?.symbol}</span>
      <Arrow />
    </Button>
  )
}
