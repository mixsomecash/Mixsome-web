import React from 'react'
import { Input } from 'antd'

interface Props {
  phoneNumber: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const PhoneNumber = ({ phoneNumber, onChange }: Props) => (
  <div>
    <p>Phone number:</p>
    <Input
      value={phoneNumber}
      onChange={onChange}
      type="text"
      placeholder="Enter the phone number including the country code.."
      className="whales-alert-address-input"
    />
  </div>
)

export { PhoneNumber }
