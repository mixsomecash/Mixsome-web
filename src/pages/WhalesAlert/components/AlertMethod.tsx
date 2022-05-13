import React from 'react'
import { Select } from 'antd'

const { Option } = Select

interface Props {
  alertMethod: string
  onChange: (value: string) => void
}

const AlertMethod = ({ alertMethod, onChange }: Props) => (
  <div>
    <p>Alert method:</p>
    <Select value={alertMethod} onChange={onChange} className="whales-alert-selector">
      <Option value="telegram">Telegram</Option>
      <Option disabled value="whatsapp">
        WhatsApp
      </Option>
      <Option disabled value="email">
        Email
      </Option>
    </Select>
  </div>
)

export { AlertMethod }
