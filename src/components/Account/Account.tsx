/* eslint-disable import/no-named-as-default */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-console */
/* eslint-disable react/react-in-jsx-scope */
import { useMoralis } from 'react-moralis'
import { getEllipsisText } from '../../utils/formatters'
import { Button, Card, Modal } from 'antd'
import { useState } from 'react'
import { SelectOutlined } from '@ant-design/icons'
import { getExplorer } from '../../utils/networks'
import Text from 'antd/lib/typography/Text'
import Address from '../Address/Address'
import Blockie from './Blockie'
import { connectors } from './config'

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
    fontSize: '25px',
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

function Account() {
  const { authenticate, isAuthenticated, account, chainId, logout } = useMoralis()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isAuthModalVisible, setIsAuthModalVisible] = useState(false)

  if (!isAuthenticated || !account) {
    return (
      <>
        <div onClick={() => setIsAuthModalVisible(true)}>
          <p style={styles.text}>Connect To Wallet</p>
        </div>
        <Modal
          visible={isAuthModalVisible}
          footer={null}
          onCancel={() => setIsAuthModalVisible(false)}
          bodyStyle={{
            padding: '15px',
            fontSize: '17px',
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
            Wallet
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {connectors.map(({ title, icon, connectorId }, key) => (
              <div
                style={styles.connector}
                key={key}
                onClick={async () => {
                  try {
                    await authenticate({ provider: connectorId as any})
                    window.localStorage.setItem('connectorId', connectorId)
                    setIsAuthModalVisible(false)
                  } catch (e) {
                    console.error(e)
                  }
                }}
              >
                <img src={icon} alt={title} style={styles.icon} />
                <Text style={{ fontSize: '14px' }}>{title}</Text>
              </div>
            ))}
          </div>
        </Modal>
      </>
    )
  }

  return (
    <>
      {/* <button
        onClick={async () => {
          try {
            console.log("change")
            await web3._provider.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x38" }],
            });
            console.log("changed")
          } catch (e) {
            console.error(e);
          }
        }}
      >
        Hi
      </button> */}
      <div style={styles.account} onClick={() => setIsModalVisible(true)}>
        <p style={{ marginRight: '5px', ...styles.text }}>{getEllipsisText(account, 6)}</p>
        <Blockie currentWallet scale={3} />
      </div>
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
          Disallet
        </Button>
      </Modal>
    </>
  )
}

export default Account