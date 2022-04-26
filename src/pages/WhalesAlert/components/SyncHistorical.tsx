import React from 'react'
import { Switch } from 'antd'

interface Props {
  value: boolean
  onChange: (value: boolean) => void
}

const SyncHistorical = ({ value, onChange }: Props) => (
  <div>
    <p>Sync historical:</p>
    <Switch checked={value} onChange={onChange} />
  </div>
)

export { SyncHistorical }
