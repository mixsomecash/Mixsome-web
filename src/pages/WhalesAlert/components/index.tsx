import React, { useState } from 'react'
import { useMoralis } from 'react-moralis'
import { Typography, Input, Button, Row, Col, Divider, Space } from 'antd'
// import validate from '../../../utils/Validate'

const { Title } = Typography

const WhalesAlert: React.FC = () => {
  const [address, setAddress] = useState<string>('')

  const onChange = event => {
    setAddress(event.target.value)
  }

  const { Moralis } = useMoralis()

  const validateAddress = async () => {
    console.log(address)
    const params = {
      republic: 'Tuva',
      capital: 'Kyzyl',
    }
    const result = await Moralis.Cloud.run('whales_alert', params)
    console.log(result)
  }

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={3}>Whales Alert</Title>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Input
            value={address}
            onChange={onChange}
            type="text"
            placeholder="Enter the address you want to watch.."
          />
        </Col>
      </Row>

      <Divider />

      <Row>
        <Col span={24}>
          <Space>
            <Button onClick={validateAddress} type="primary">
              Submit
            </Button>
            <Button>Reset</Button>
          </Space>
        </Col>
      </Row>
    </>
  )
}

export default WhalesAlert
