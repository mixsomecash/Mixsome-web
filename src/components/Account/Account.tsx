import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { Button as CustomButton } from 'components'
import { Button, Card, Modal } from 'antd'
import { SelectOutlined } from '@ant-design/icons'
import Text from 'antd/lib/typography/Text'
import { getExplorer } from '../../utils/networks'
import { getEllipsisText } from '../../utils/formatters'
import Address from '../Address/Address'
import Blockie from './Blockie'
import { connectors } from './config'

export declare type Web3Provider = 'wc' | 'walletconnect'

const styles = {
  account: {
    height: '42px',
    padding: '0 15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    borderRadius: '12px',
    backgroundColor: 'rgb(244, 244, 244)',
    cursor: 'pointer',
  },
  text: {
    color: '#21BF96',
  },
  connector: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: 'auto',
    justifyContent: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '20px 5px',
    cursor: 'pointer',
  } as const,
  icon: {
    alignSelf: 'center',
    fill: 'rgb(40, 13, 95)',
    flexShrink: '0',
    marginBottom: '8px',
    height: '30px',
  },
}

const Account = () => {
  const { authenticate, isAuthenticated, isInitialized, account, chainId, logout } = useMoralis()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)

  const connectToWallet = async (connectorId: Web3Provider) => {
    try {
      await authenticate({ provider: connectorId })
      window.localStorage.setItem('connectorId', connectorId)
      setIsAuthModalVisible(false)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (!isInitialized) {
      return
    }
    const connectorId = window.localStorage.getItem('connectorId')
    if (connectorId) {
      ;(async () => {
        try {
          await authenticate({ provider: connectorId as Web3Provider })
        } catch (e) {
          console.error(e)
        }
      })()
    }
  }, [authenticate, isInitialized])

  if (!isAuthenticated || !account) {
    return (
      <>
        <CustomButton text="Connect To Wallet" onClick={() => setIsAuthModalVisible(true)} />
        <Modal
          visible={isAuthModalVisible}
          footer={null}
          onCancel={() => setIsAuthModalVisible(false)}
          bodyStyle={{
            padding: '15px',
            fontSize: '25px',
            fontWeight: '500',
          }}
          style={{ fontSize: '16px', fontWeight: '500' }}
          width="340px"
        >
          <div
            style={{
              padding: '10px',
              display: 'flex',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '20px',
            }}
          >
            Connect Wallet
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {connectors.map(({ title, icon, connectorId }) => (
              <button
                type="button"
                style={styles.connector}
                key={title}
                onClick={() => connectToWallet(connectorId as Web3Provider)}
              >
                <img src={icon} alt={title} style={styles.icon} />
                <Text style={{ fontSize: '14px' }}>{title}</Text>
              </button>
            ))}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <>
      <button type="button" style={styles.account} onClick={() => setIsModalVisible(true)}>
        <p style={{ marginRight: '5px', ...styles.text }}>{getEllipsisText(account, 6)}</p>
        <Blockie currentWallet scale={3} />
      </button>
      <Modal
        visible={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        bodyStyle={{
          padding: '15px',
          fontSize: '17px',
          fontWeight: '500',
        }}
        style={{ fontSize: '16px', fontWeight: '500' }}
        width="400px"
      >
        Account
        <Card
          style={{
            marginTop: '10px',
            borderRadius: '1rem',
          }}
          bodyStyle={{ padding: '15px' }}
        >
          <Address avatar="left" size={6} copyable style={{ fontSize: '20px' }} />
          <div style={{ marginTop: '10px', padding: '0 10px' }}>
            <a href={`${getExplorer(chainId)}/address/${account}`} target="_blank" rel="noreferrer">
              <SelectOutlined style={{ marginRight: '5px' }} />
              View on Explorer
            </a>
          </div>
        </Card>
        <Button
          size="large"
          type="primary"
          style={{
            width: '100%',
            marginTop: '10px',
            borderRadius: '0.5rem',
            fontSize: '16px',
            fontWeight: '500',
          }}
          onClick={async () => {
            await logout()
            window.localStorage.removeItem('connectorId')
            setIsModalVisible(false)
          }}
        >
          Disconnect Wallet
        </Button>
      </Modal>
    </>
  )
}

export default Account
