import { notification } from 'antd'
import { Moralis } from 'moralis'
import { ChainId } from 'types/moralis'
import { AllowanceDto, ApprovalTransactions } from './types'

const APPROVE = 'approve'

const SIGNATURES_URL = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/'

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
      console.log(native)

      return {
        transactionHash: transaction.hash,
        contractAddress: transaction.to_address,
        functionName,
        timestamp: transaction.block_timestamp,
        allowance: await getAllowance({
          chainId,
          ownerAddress: '0x' + native.logs[0]?.topic1?.slice(-40),
          spenderAddress: '0x' + native.logs[0]?.topic2?.slice(-40),
          contractAddress: native.logs[0]?.address,
        }),
      }
    }),
  )
  return approvals.filter(transaction => !!transaction) as ApprovalTransactions[]
}

const getAllowance = async (allowanceDto: AllowanceDto) => {
  try {
    const { allowance } = await Moralis.Web3API.token.getTokenAllowance({
      chain: allowanceDto.chainId,
      owner_address: allowanceDto.ownerAddress,
      spender_address: allowanceDto.spenderAddress,
      address: allowanceDto.contractAddress,
    })
    console.log('allowance', allowance)
    return allowance
  } catch (ignore) {
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

export const revoke = async (
  accountAddress: string | null,
  contractAddress: string | null,
  chainId: ChainId,
) => {
  console.log('approve')
  const { message, code } = await Moralis.Plugins.oneInch.approve({
    chain: chainId,
    fromAddress: accountAddress,
    tokenAddress: contractAddress,
  })
  notification.info({
    message: "Error",
    description: message,
  });
}

// export const getTokenMetaData = (contractAddress: string, chainId: ChainId) => {
//   try {
//     return Moralis.Web3API.token
//       .getTokenMetadata({
//         chain: chainId,
//         addresses: [contractAddress],
//       })
//       .then(metadatas => metadatas[0])
//   } catch {
//     return null
//   }
// }
