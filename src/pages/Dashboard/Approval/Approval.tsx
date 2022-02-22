import { CloseOutlined, CopyOutlined, InfoCircleOutlined, MoreOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import { ErrorMessage, Loader } from 'components'
import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { ChainId } from 'types/moralis'
import { getEllipsisText } from 'utils/formatters'
import { getApprovals, revoke, revokeTokens } from './ApprovalHelp'
import { ApprovalTransactions } from './types'

const copyToClipboard = text => {
  if (navigator.clipboard)
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notification.success({
          message: 'Copied to clipboard',
        })
      })
      .catch(err => {
        notification.info({
          message: 'Error',
          description: "Can't copy to clipboard",
        })
      })
  else
    notification.info({
      message: 'Error',
      description: "Can't copy to clipboard",
    })
}

const Approval = () => {
  const { chainId, account } = useMoralis()
  const [isLoading, setIsLoading] = useState(true)
  const [showActionsDropdown, setShowActionsDropdown] = useState<string>('')
  const [approvals, setApprovals] = useState<ApprovalTransactions[]>([])

  const columns = [
    {
      title: '',
      render: (transaction: ApprovalTransactions) => (
        <img
          src={
            transaction.metadata?.thumbnail || 'https://etherscan.io/images/main/empty-token.png'
          }
          alt={transaction.metadata?.name}
          width="20px"
          height="20px"
        />
      ),
    },
    {
      title: 'Contract',
      render: (transaction: ApprovalTransactions) => (
        <div
          onClick={() => copyToClipboard(transaction.contractAddress)}
          onKeyPress={() => copyToClipboard(transaction.contractAddress)}
          role="button"
          tabIndex={0}
        >
          {getEllipsisText(transaction.contractAddress)}
          &nbsp;
          <CopyOutlined className="text-light align-middle" />
        </div>
      ),
    },
    {
      title: 'Date',
      render: (transaction: ApprovalTransactions) => new Date(transaction.timestamp).toUTCString(),
    },
    {
      title: 'Spender',
      render: (transaction: ApprovalTransactions) => (
        <div
          onClick={() => copyToClipboard(transaction.spenderAddress)}
          onKeyPress={() => copyToClipboard(transaction.spenderAddress)}
          role="button"
          tabIndex={0}
        >
          {getEllipsisText(transaction.spenderAddress)}
          &nbsp;
          <CopyOutlined className="text-light align-middle" />
        </div>
      ),
    },
    {
      title: 'Approved Amount',
      render: (transaction: ApprovalTransactions) => transaction.allowance,
    },
    {
      title: 'Actions',
      render: (transaction: ApprovalTransactions) => (
        <>
          <button
            onClick={() => setShowActionsDropdown(transaction.transactionHash)}
            type="button"
            className="inline-flex justify-center w-full rounded-md  px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          >
            <MoreOutlined />
          </button>
          {showActionsDropdown === transaction.transactionHash && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
            >
              <div className="py-1" role="none">
                {chainId === '0x1' && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://etherscan.io/tx/${transaction.transactionHash}`}
                    className="text-light hover:text-black block px-4 py-2 text-sm"
                    tabIndex={-1}
                  >
                    <InfoCircleOutlined className="align-middle" />
                    &nbsp;Open In Etherscan
                  </a>
                )}
                {chainId === '0x38' && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://bscscan.com/tx/${transaction.transactionHash}`}
                    className="text-light hover:text-black block px-4 py-2 text-sm"
                    tabIndex={-1}
                  >
                    <InfoCircleOutlined className="align-middle" />
                    &nbsp;Open In BscScan
                  </a>
                )}

                <button
                  type="button"
                  className=" text-light hover:text-black block px-4 py-2 text-sm"
                  onClick={() => {
                    revokeTokens(transaction.contractAddress, transaction.spenderAddress, account)
                  }}
                >
                  <CloseOutlined className="align-middle" />
                  &nbsp;Revoke
                </button>
              </div>
            </div>
          )}
        </>
      ),
    },
  ]

  useEffect(() => {
    ;(async () => {
      if (!account || !chainId) {
        setIsLoading(false)
        return
      }
      const result = await getApprovals(account, chainId as ChainId)
      setIsLoading(false)
      if (result) {
        setApprovals(result)
      }
    })()
  }, [account, chainId])

  return (
    <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
      <div className="pb-10 xl:flex items-center">
        <p className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">
          Approvals
        </p>
      </div>
      {isLoading && <Loader />}
      {!isLoading && approvals && approvals.length > 0 && (
        <div className="scrollable-table-wrapper" style={{ overflow: 'visible' }}>
          <table className="table-auto w-full xl:mt-4">
            <thead className="border-b border-black border-opacity-20 pb-10">
              <tr>
                {columns.map(column => (
                  <td key={column.title} className="pr-4">
                    <span className="opacity-60 text-14 xl:text-16">{column.title}</span>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {approvals.map(transaction => (
                <tr key={`${transaction.transactionHash}`}>
                  {columns.map(column => (
                    <td key={column.title}>{column.render(transaction)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && account && approvals.length === 0 && (
        <ErrorMessage message="No approved contracts found for the address" />
      )}
      {!isLoading && !account && <ErrorMessage message="Please connect your wallet" />}
    </div>
  )
}

export default Approval
