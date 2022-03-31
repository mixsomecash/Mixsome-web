import React from 'react'
import { Alert, Button, Modal as AndModal, Input } from 'antd'

import { OnCancel, SetWarning, SetAddress } from '../../../types/models/nft'

interface ModalProps {
  visible: boolean
  onCancel: OnCancel
  warning: string | null
  setWarning: SetWarning
  address: string
  setAddress: SetAddress
}

export const Modal: React.FC<ModalProps> = (props: ModalProps) => {
  const { visible, onCancel, warning, setWarning, address, setAddress } = props

  const warningMessage = 'NFT transfer is not available at the moment! Sorry for the Inconvenience'

  return (
    <AndModal
      title="Transfer NFT"
      visible={visible}
      onCancel={onCancel}
      onOk={() => setWarning(warningMessage)}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="send"
          onClick={() => setWarning(warningMessage)}
          disabled={address.length === 0}
        >
          Send
        </Button>,
      ]}
    >
      <Input
        size="large"
        placeholder="Public address"
        value={address}
        onChange={event => setAddress(event.target.value)}
      />
      {warning && (
        <div style={{ marginTop: '10px' }}>
          <Alert message={warning} type="warning" closable onClose={() => setWarning(null)} />
        </div>
      )}
    </AndModal>
  )
}
