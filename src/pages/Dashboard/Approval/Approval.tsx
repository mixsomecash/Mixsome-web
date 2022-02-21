import { CopyOutlined } from '@ant-design/icons'
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
      render: (transaction: ApprovalTransactions) => <>{transaction.allowance}</>,
    },
    {
      title: 'Revoke',
      render: (transaction: ApprovalTransactions) => (
        // eslint-disable-next-line react/button-has-type
        <button
          className="text-black bg-extra-light  hover:bg-light  hover:text-white font-bold py-2 px-4 rounded-full"
          onClick={() => {
            revokeTokens(transaction.contractAddress, transaction.spenderAddress,account)
          }}
        >
          Revoke
        </button>
      ),
    },
  ]

  useEffect(() => {
    ; (async () => {
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
