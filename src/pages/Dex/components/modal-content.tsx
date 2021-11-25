import React, { useState, useEffect, useMemo } from 'react'
import Select from 'react-select'

import type { DexToken } from '../../../types/models/dex'

import type { HandleModal } from './card'

interface ModalContentProps {
  open: boolean
  onClose: (value: HandleModal) => void
  setToken: (value: DexToken) => void
  tokenList: DexToken[]
}

export const ModalContent: React.FC<ModalContentProps> = (props: ModalContentProps) => {
  const { open, onClose, setToken, tokenList } = props

  const [value, setValue] = useState<DexToken | null>(null)

  const handleChange = selectedToken => {
    setToken(selectedToken)
    onClose({ open: false, direction: 'from' })
    setValue(null)
  }

  return (
    <div style={{ overflow: 'auto', height: '346px' }}>
      <Select
        value={value}
        options={tokenList}
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
  )
}
