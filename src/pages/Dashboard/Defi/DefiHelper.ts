import { Moralis } from 'moralis'
import { ethers } from 'ethers'
import { ChainId } from 'types/moralis'
import { contracts } from 'data/defi/contracts'
import { DefiTransaction } from './types'

export const getDefiTransactions = async (
  accountAddress: string,
  chainId: ChainId,
): Promise<DefiTransaction[] | null> => {
  const transfers = (await Moralis.Web3API.account
    .getTokenTransfers({ chain: chainId, address: accountAddress })
    .catch(() => null)) as any
  if (!transfers.result) {
    return null
  }
  const defiTransactions = await Promise.all(
    transfers.result.map(async (transfer): Promise<DefiTransaction | null> => {
      const transaction = await Moralis.Web3API.native
        .getTransaction({ transaction_hash: transfer.transaction_hash, chain: chainId })
        .catch(() => null)
      if (!transaction) {
        return null
      }
      const transactionDefiData = contracts[transaction.to_address]
      if (!transactionDefiData) {
        return null
      }
      const { abi } = transactionDefiData
      const contractInterface = new ethers.utils.Interface(abi)
      const inputData = contractInterface.parseTransaction({ data: transaction.input })
      if (
        !inputData ||
        inputData.name !== transactionDefiData.function ||
        !inputData.args[transactionDefiData.argument]
      ) {
        return null
      }
      return {
        transactionHash: transaction.hash,
        contractAddress: transaction.to_address,
        token: transfer.address,
        function: transactionDefiData.function,
        amount: Moralis.Units.FromWei(
          inputData.args[transactionDefiData.argument],
          transactionDefiData.decimals,
        ),
      }
    }),
  )
  return defiTransactions.filter(transaction => !!transaction) as DefiTransaction[]
}
