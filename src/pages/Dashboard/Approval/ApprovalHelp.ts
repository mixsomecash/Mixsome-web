import { notification } from 'antd'
import { Moralis } from 'moralis'
import { ChainId } from 'types/moralis'
import { ApprovalTransactions } from './types'

const APPROVE = 'approve'

const SIGNATURES_URL = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/'
const getFunctionName = async (signatureBytesString): Promise<string | null> => {
  try {
    const signatureResponse = await fetch(`${SIGNATURES_URL}${signatureBytesString}`)
    if (!signatureResponse.ok) {
      return null
    }
    const signature = await signatureResponse.text()
    const functionName = signature.split('(')[0]
    return functionName
  } catch (err) {
    return null
  }
}

const getAllowance = async (native, chainId) => {
  try {
    const { allowance } = await Moralis.Web3API.token.getTokenAllowance({
      chain: chainId,
      owner_address: `0x${native.logs[0]?.topic1?.slice(-40)}`,
      spender_address: `0x${native.logs[0]?.topic2?.slice(-40)}`,
      address: native.logs[0]?.address,
    })
    return allowance
  } catch (err) {
    return 'NaN'
  }
}

export const getApprovals = async (
  accountAddress: string,
  chainId: ChainId,
): Promise<ApprovalTransactions[] | null> => {
  const transactions = await Moralis.Web3API.account
    .getTransactions({
      chain: chainId,
      address: accountAddress,
    })
    .catch(() => null)

  if (!transactions?.result) {
    return null
  }
  const approvals = await Promise.all(
    transactions.result.map(async transaction => {
      const signatureBytesString = transaction.input.substring(2, 10)
      if (signatureBytesString.length !== 8) {
        return null
      }

      const functionName = await getFunctionName(signatureBytesString)

      const native = await Moralis.Web3API.native.getTransaction({
        chain: chainId,
        transaction_hash: transaction.hash,
      })
      if (functionName !== APPROVE) {
        return null
      }

      return {
        transactionHash: transaction.hash,
        contractAddress: transaction.to_address,
        functionName,
        timestamp: transaction.block_timestamp,
        allowance: await getAllowance(native, chainId),
      }
    }),
  )
  return approvals.filter(transaction => !!transaction) as ApprovalTransactions[]
}

export const revoke = async (
  accountAddress: string | null,
  contractAddress: string | null,
  chainId: ChainId,
) => {
  const { message } = await Moralis.Plugins.oneInch.approve({
    chain: chainId,
    fromAddress: accountAddress,
    tokenAddress: contractAddress,
  })
  notification.info({
    message: 'Error',
    description: message,
  })
}
