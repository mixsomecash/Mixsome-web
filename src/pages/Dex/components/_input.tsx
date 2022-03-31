import React from 'react'
import { useMoralis } from 'react-moralis'
import { InputNumber } from 'antd'

interface SetValue {
  (value: number | string): void
}

interface InputProps {
  decimals: number
  direction: string
  value: number | string
  setValue: SetValue
}

export const Input: React.FC<InputProps> = (props: InputProps) => {
  const { decimals, direction, value, setValue } = props

  const { Moralis } = useMoralis()

  const onChange = inputValue => setValue(inputValue)

  const toValue = !value ? value : parseFloat(Moralis.Units.FromWei(value, decimals)).toFixed(6)

  return (
    <InputNumber
      readOnly={direction === 'To'}
      value={direction === 'From' ? value : toValue}
      // value={value || ''}
      onChange={onChange}
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
  )
}
