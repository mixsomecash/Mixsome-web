import { notification } from 'antd'
import { Moralis } from 'moralis'
import { ChainId } from 'types/moralis'
import tokenAbi from 'utils/ERC20.json'
import { AbiItem } from 'web3-utils'
import { ApprovalTransactions, TokenMetadata } from './types'

const APPROVE = 'approve'

const SIGNATURES_URL = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/'

const getTokenMetadata = async (
  addresses: string[],
  chainId: ChainId,
): Promise<TokenMetadata[] | null> => {
  try {
    const metaData = await Moralis.Web3API.token.getTokenMetadata({
      chain: chainId,
      addresses,
    })
    console.log('meta', metaData)
    return metaData
  } catch (error) {
    return null
  }
}

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
    return { allowance, spenderAddress: `0x${native.logs[0]?.topic2?.slice(-40)}` }
  } catch (err) {
    return {
      allowance: 0,
      spenderAddress: 'N/A',
    }
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
  const addresses: string[] = []
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
      addresses.push(transaction.to_address)
      const { spenderAddress, allowance } = await getAllowance(native, chainId)
      return {
        transactionHash: transaction.hash,
        contractAddress: transaction.to_address,
        functionName,
        timestamp: transaction.block_timestamp,
        allowance,
        spenderAddress,
        metadata: null,
      }
    }),
  )
  const tokenMetadatas = await getTokenMetadata(addresses, chainId)

  return approvals
    .filter(transaction => !!transaction)
    .map(transaction => {
      return {
        ...transaction,
        metadata: tokenMetadatas?.find(token => token.address === transaction?.contractAddress),
      }
    }) as ApprovalTransactions[]
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

export const revokeTokens = async (
  contract_address: string,
  spender_address: string,
  account?: string | null,
) => {
  try {
    const connector = await Moralis.Web3.enableWeb3()
    const tokenContract = new connector.eth.Contract(tokenAbi as AbiItem[], contract_address)
    const allowance = await tokenContract.methods
      .allowance(account, spender_address)
      .call({ from: account })
    await tokenContract.methods
      .decreaseAllowance(spender_address, allowance)
      .send({ from: account })
    return true
  } catch {
    return false
  }
}
