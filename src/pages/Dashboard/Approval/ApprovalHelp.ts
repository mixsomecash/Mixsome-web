import { Moralis } from 'moralis'
import { ChainId } from 'types/moralis'
import erc20Abi from 'utils/ERC20.json'
import Web3 from 'web3'
import { ApprovalTransactions, TokenMetadata } from './types'

const APPROVE_SHA3 = '0x095ea7b3'
const MAX_APPROVAL_AMOUNT = 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
const MIN_APPROVAL_AMOUNT = '0000000000000000000000000000000000000000000000000000000000000000'

// const SIGNATURES_URL = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/'

const calculateAllowance = (allowance: string, decimals: string) => {
  return allowance === MAX_APPROVAL_AMOUNT
    ? 'Unlimited'
    : Moralis.Units.FromWei(Web3.utils.hexToNumberString(`0x${allowance}`), parseInt(decimals, 10))
}

const getTokenMetadata = async (
  addresses: string[],
  chainId: ChainId,
): Promise<TokenMetadata[] | null> => {
  try {
    const metaDatas = await Moralis.Web3API.token.getTokenMetadata({
      chain: chainId,
      addresses,
    })
    return metaDatas
  } catch (error) {
    return null
  }
}

const parseApproveInputData = (input_data: string) => {
  if (input_data.length !== 138) {
    return {
      spenderAddress: 'N/A',
      allowance: MIN_APPROVAL_AMOUNT,
    }
  }
  // check every 256 bit after first 32 bit to see function inputs data
  const amount = input_data.slice(10).slice(-64)
  return {
    spenderAddress: input_data.slice(10).slice(0, 64).slice(-40),
    allowance: amount,
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
  const transactionsToShow: ApprovalTransactions[] = []
  const approvals = await Promise.all(
    transactions.result.map(async transaction => {
      const signatureBytesString = transaction.input.substring(0, 10)
      if (signatureBytesString !== APPROVE_SHA3) {
        return null
      }

      const inputData = parseApproveInputData(transaction.input)

      if (
        transactionsToShow.findIndex(
          t =>
            t.spenderAddress === `0x${inputData?.spenderAddress}` &&
            t.contractAddress === transaction.to_address,
        ) === -1
      ) {
        const txn: ApprovalTransactions = {
          transactionHash: transaction.hash,
          contractAddress: transaction.to_address,
          timestamp: transaction.block_timestamp,
          allowance: inputData.allowance,
          spenderAddress: `0x${inputData?.spenderAddress}`,
          metadata: null,
        }
        transactionsToShow.push(txn)
        if (inputData.allowance !== MIN_APPROVAL_AMOUNT) addresses.push(transaction.to_address)
        return txn
      }
      return null
    }),
  )
  const metadatas = await getTokenMetadata(addresses, chainId)

  return approvals
    .map(transaction => {
      const myMetadata = metadatas?.find(token => token.address === transaction?.contractAddress)
      if (!myMetadata) {
        return null
      }
      return {
        ...transaction,
        allowance: calculateAllowance(transaction?.allowance || '0', myMetadata?.decimals || '18'),
        metadata: myMetadata,
      }
    })
    .filter(transaction => !!transaction && transaction.allowance !== '0') as ApprovalTransactions[]
}

export const revokeTokens = async (
  contract_address: string,
  spender_address: string,
  cb: ({ isSuccess, message }) => void,
) => {
  try {
    await Moralis.executeFunction({
      contractAddress: contract_address,
      functionName: 'revoke',
      params: {
        spender_address,
        amount: Moralis.Units.Token('0'),
      },
      abi: erc20Abi,
    })
    cb({
      isSuccess: true,
      message: 'The token has been revoked',
    })
    return true
  } catch (err) {
    cb({
      isSuccess: false,
      message: 'Somthing went wrong',
    })
    return false
  }
}
