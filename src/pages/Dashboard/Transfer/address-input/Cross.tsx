import React from 'react'

type SetValidatedAddress = {
  (value: string): void
}

type SetIsDomain = {
  (value: boolean): void
}

interface CrossProps {
  setValidatedAddress: SetValidatedAddress
  setIsDomain: SetIsDomain
}

export const Cross: React.FC<CrossProps> = (props: CrossProps) => {
  const { setValidatedAddress, setIsDomain } = props

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#E33132"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={() => {
        setValidatedAddress('')
        setIsDomain(false)
      }}
      style={{ cursor: 'pointer' }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}
