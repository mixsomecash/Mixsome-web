import React from 'react'
import { Input } from 'antd'

interface Props {
  address: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Address = ({ address, onChange }: Props) => (
  <div>
    <p>Address:</p>
    <Input
      value={address}
      onChange={onChange}
      type="text"
      placeholder="Enter the address you want to watch.."
      className="whales-alert-address-input"
    />
  </div>
)

export { Address }
