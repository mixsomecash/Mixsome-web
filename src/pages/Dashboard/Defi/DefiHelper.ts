import { Moralis } from 'moralis'
import { ChainId } from 'types/moralis'
import { DefiTransaction } from './types'

const EXCLUDED_FUNCTIONS = [
  'transfer',
  'swapETHForExactTokens',
  'swapExactETHForTokens',
  'swapExactTokensForETH',
  'swapExactTokensForTokens',
  'swapTokensForExactETH',
  'swapTokensForExactTokens',
  'swap',
]

const SIGNATURES_URL = 'https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/'

export const getDefiTransactions = async (
  accountAddress: string,
  chainId: ChainId,
): Promise<DefiTransaction[] | null> => {
  const transactions = await Moralis.Web3API.account
    .getTransactions({ chain: chainId, address: accountAddress })
    .catch(() => null)
  if (!transactions?.result) {
    return null
  }
  const defiTransactions = await Promise.all(
    transactions.result.map(async transaction => {
      const signatureBytesString = transaction.input.substring(2, 10)
      if (signatureBytesString.length !== 8) {
        return null
      }
      const signatureResponse = await fetch(`${SIGNATURES_URL}${signatureBytesString}`)
      if (!signatureResponse.ok) {
        return null
      }
      const signature = await signatureResponse.text()
      const functionName = signature.split('(')[0]
      if (functionName.length === 0 || EXCLUDED_FUNCTIONS.includes(functionName)) {
        return null
      }

      return {
        transactionHash: transaction.hash,
        contractAddress: transaction.to_address,
        functionName,
        timestamp: transaction.block_timestamp,
      }
    }),
  )
  return defiTransactions.filter(transaction => !!transaction) as DefiTransaction[]
}
