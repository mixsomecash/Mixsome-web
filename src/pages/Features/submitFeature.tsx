import React, { useState } from 'react'
import { Modal, Button, Input } from 'antd'
import { useMoralis } from 'react-moralis'

const { TextArea } = Input

const ModalComponent = () => {
  const { Moralis, isInitialized, account, isAuthenticated } = useMoralis()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [titleValue, setTitleValue] = useState('')
  const [descriptionValue, setDescriptionValue] = useState('')

  const showModal = () => {
    setIsModalVisible(true)
  }

  const addFeature = async () => {
    if (account != null) {
      const FeatureObject = await Moralis.Object.extend('Feature')
      const feature = new FeatureObject()
      const featureTitle = titleValue
      const featureDescription = descriptionValue
      console.log(featureDescription)
      console.log(account)
      feature.set('title', featureTitle)
      feature.set('description', featureDescription)
      feature.set('contributor', account)
      feature.set('likes', 1)
      feature.addUnique('supporters', account)
      feature.save()
      setIsModalVisible(false)
    } else {
      alert('Connect wallet to submit your feature')
    }
  }

  const handleOk = () => {
    addFeature()
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
          onKeyDown={() => console.log('')}
          className="text-right"
          style={{
            display: 'inline-flex',
            float: 'left',
            padding: '0px 30px 0px 30px',
            height: '63px',
            borderStyle: 'none',
            backgroundColor: '#6EEB7E',
            color: '#000000',
            fontFamily: 'DM Sans',
            lineHeight: '60px',
            fontSize: '18px',
            fontStyle: 'normal',
            letterSpacing: ' -0.01em',
            fontWeight: 500,
          }}
        >
          <h1>Propose a Feature</h1>
        </div>
      </div>
      <Modal visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p className="pt-5 pl-2">TITLE</p>
        <Input
          id="featureTitle"
          placeholder="Basic usage"
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
          placeholder="maxLength is 6"
          maxLength={300}
        />
      </Modal>
    </>
  )
}

export default ModalComponent
