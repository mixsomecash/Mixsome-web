/* eslint-disable no-alert */
import { CloseOutlined, CopyOutlined, LoadingOutlined } from '@ant-design/icons'
import { notification } from 'antd'
import { ErrorMessage, Loader } from 'components'
import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { ChainId } from 'types/moralis'
import { getEllipsisText } from 'utils/formatters'
import { getApprovals, revokeTokens } from './ApprovalHelp'
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
      .catch(() => {
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
  const [approvalsChanged, setApprovalsChanged] = useState<number>(0)
  const [approvals, setApprovals] = useState<ApprovalTransactions[]>([])
  const [revokeLoadings, setRevokeLoadings] = useState<string[]>([])
  useEffect(() => {
    setIsLoading(true)
    ;(async () => {
      if (!account || !chainId) {
        setIsLoading(false)
        return
      }
      const result = await getApprovals(account, chainId as ChainId)
      setIsLoading(false)
      if (result) {
        setApprovals(result)
        setRevokeLoadings([])
      }
    })()
  }, [account, chainId, approvalsChanged])

  const handleRevokeLoading = (contractAddress, spenderAddress, transactionHash) => {
    setRevokeLoadings([...revokeLoadings, transactionHash])
    revokeTokens(contractAddress, spenderAddress, account, async ({ isSuccess, message }) => {
      setRevokeLoadings(revokeLoadings.filter(item => item !== transactionHash))
      if (isSuccess) {
        setApprovalsChanged(Math.random())
        notification.success({
          message: 'Success',
          description: message,
        })
      } else {
        notification.error({
          message: 'Failed to Revoke',
          description: message,
        })
      }
    })
  }

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
        <>
          {chainId === '0x1' && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://etherscan.io/tx/${transaction.transactionHash}`}
              className="text-light hover:text-black block px-4 py-2 text-sm"
              tabIndex={-1}
            >
              {getEllipsisText(transaction.contractAddress)}
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
              {getEllipsisText(transaction.contractAddress)}
            </a>
          )}
          {chainId === '0xa86a' && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://snowtrace.io/tx/${transaction.transactionHash}`}
              className="text-light hover:text-black block px-4 py-2 text-sm"
              tabIndex={-1}
            >
              {getEllipsisText(transaction.contractAddress)}
            </a>
          )}
          {chainId === '0x89' && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://polygonscan.com/tx/${transaction.transactionHash}`}
              className="text-light hover:text-black block px-4 py-2 text-sm"
              tabIndex={-1}
            >
              {getEllipsisText(transaction.contractAddress)}
            </a>
          )}
          {chainId !== '0x38' && chainId !== '0x1' && '0x89' && chainId !== '0xa86a' && (
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://bscscan.com/tx/${transaction.transactionHash}`}
              className="text-light hover:text-black block px-4 py-2 text-sm"
              tabIndex={-1}
            >
              {getEllipsisText(transaction.contractAddress)}
            </a>
          )}
        </>
      ),
    },
    {
      title: 'Date',
      render: (transaction: ApprovalTransactions) => (
        <span className="opacity-70">{new Date(transaction.timestamp).toUTCString()}</span>
      ),
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
      render: (transaction: ApprovalTransactions) => (
        <span className="font-bold">{transaction.allowance}</span>
      ),
    },
    {
      title: 'Actions',
      render: (transaction: ApprovalTransactions) => (
        <>
          {!revokeLoadings.includes(transaction.transactionHash) ? (
            <button
              type="button"
              className=" text-light hover:text-black border-light border hover:border-black px-3 py-2 text-sm bg-white"
              onClick={() => {
                handleRevokeLoading(
                  transaction.contractAddress,
                  transaction.spenderAddress,
                  transaction.transactionHash,
                )
              }}
            >
              <CloseOutlined className="align-middle" />
              &nbsp;Revoke
            </button>
          ) : (
            <button
              type="button"
              className=" text-light hover:text-black border-light border hover:border-black px-3 py-2 text-sm bg-white"
            >
              <LoadingOutlined />
            </button>
          )}
        </>
      ),
    },
  ]

  return (
    <div className="w-full bg-white px-6 py-4 xl:px-12 xl:py-10">
      <div className="pb-10 xl:flex items-center">
        <p className="font-medium text-20 leading-26 my-4 xl:my-0 xl:text-32 xl:leading-42">
          Approvals
        </p>
      </div>
      {isLoading && <Loader />}
      {!isLoading && approvals && approvals.length > 0 && (
        <div className="scrollable-table-wrapper">
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
