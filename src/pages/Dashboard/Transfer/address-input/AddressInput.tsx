import React, { useCallback, useEffect, useState } from 'react'
import { useMoralis, useMoralisWeb3Api } from 'react-moralis'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import Text from 'antd/lib/typography/Text'
import { getEllipsisText } from 'utils/formatters'
import { Blockie } from './Blockie'
import { Cross } from './Cross'

type OnChange = {
  (value: any): void
}

interface AddressInputProps {
  autoFocus?: boolean
  onChange: OnChange
  placeholder?: string
  style?: any
}

export const AddressInput: React.FC<AddressInputProps> = (props: AddressInputProps) => {
  const { autoFocus, onChange, placeholder, style } = props
  const { web3 } = useMoralis()
  const [address, setAddress] = useState('')
  const [validatedAddress, setValidatedAddress] = useState('')
  const [isDomain, setIsDomain] = useState(false)
  const {
    resolve: { resolveDomain },
  } = useMoralisWeb3Api()

  useEffect(() => {
    if (validatedAddress) onChange(isDomain ? validatedAddress : address)
  }, [onChange, validatedAddress, isDomain, address])

  function isSupportedDomain(domain) {
    return [
      '.eth',
      '.crypto',
      '.coin',
      '.wallet',
      '.bitcoin',
      '.x',
      '.888',
      '.nft',
      '.dao',
      '.blockchain',
    ].some(tld => domain.endsWith(tld))
  }

  const updateAddress = useCallback(
    async value => {
      setAddress(value)
      if (isSupportedDomain(value)) {
        const processPromise = function promiseFunc(promise) {
          promise
            .then(addr => {
              setValidatedAddress(addr)
              setIsDomain(true)
            })
            .catch(() => {
              setValidatedAddress('')
            })
        }
        if (value.endsWith('.eth')) {
          processPromise(web3?.eth.ens.getAddress(value))
        } else {
          processPromise(
            resolveDomain({
              domain: value,
            }).then(r => r.address),
          )
        }
      } else if (value.length === 42) {
        setValidatedAddress(getEllipsisText(value, 10))
        setIsDomain(false)
      } else {
        setValidatedAddress('')
        setIsDomain(false)
      }
    },
    [resolveDomain, web3],
  )

  return (
    <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: '80px', width: '100%' }}>
        <Text strong>Address:</Text>
      </div>
      <Input
        size="large"
        placeholder={placeholder || 'Public address'}
        prefix={
          isDomain || address.length === 42 ? (
            <Blockie
              address={(isDomain ? validatedAddress : address).toLowerCase()}
              size={8}
              scale={3}
            />
          ) : (
            <SearchOutlined />
          )
        }
        suffix={
          validatedAddress && (
            <Cross setValidatedAddress={setValidatedAddress} setIsDomain={setIsDomain} />
          )
        }
        autoFocus={autoFocus}
        value={
          isDomain
            ? `${address} (${getEllipsisText(validatedAddress)})`
            : validatedAddress || address
        }
        onChange={event => {
          updateAddress(event.target.value)
        }}
        disabled={!!validatedAddress}
        style={
          validatedAddress ? { ...style, border: '1px solid rgb(33, 191, 150)' } : { ...style }
        }
      />
    </div>
  )
}
