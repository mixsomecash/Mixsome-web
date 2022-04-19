import React, { useState } from 'react'
import { Modal, Input, message } from 'antd'
import { useMoralis } from 'react-moralis'
import { useSubmitFeature } from 'hooks/useSubmitFeature'

const { TextArea } = Input

const ModalComponent = props => {
  const { account } = useMoralis()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [titleValue, setTitleValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')
  const { approve } = useSubmitFeature()

  const showModal = () => {
    if (account) {
      setIsModalVisible(true)
    } else {
      message.info('Connect your wallet to propose a feature')
    }
  }

  const addFeature = async () => {
    if (account != null) {
      approve(titleValue, descriptionValue)
      setIsModalVisible(false)
      message.info('Your feature was submitted for review')
    }
  }

  const handleOk = async () => {
    await addFeature()
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <div>
        <div
          role="button"
          tabIndex={-1}
          onClick={showModal}
          onKeyDown={() => {
            return null
          }}
          className="btn-propose"
        >
          <h1>Propose a Feature</h1>
        </div>
      </div>
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p className="pt-5 pl-2">TITLE</p>
        <Input
          maxLength={45}
          id="featureTitle"
          placeholder="Short, descriptive title"
          onChange={e => {
            setTitleValue(e.target.value)
          }}
        />
        <p className="pt-3 pl-2">DETAILS</p>
        <TextArea
          id="featureDescription"
          onChange={e => {
            setDescriptionValue(e.target.value)
          }}
          rows={4}
          placeholder="Any additional details..."
          maxLength={300}
        />
      </Modal>
    </>
  )
}

export default ModalComponent
