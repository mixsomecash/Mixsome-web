import Moralis from 'moralis'
import { ChainId } from 'types/moralis'

export type GenericTransfer = {
  address: string
  symbol?: string
  fromAddress: string
  toAddress: string
  value: string
  transactionHash: string
  blockTimestamp: string
  type: 'erc20' | 'nft'
}

export const erc20ToGenericTransfer = (erc20Transfer, tokenSymbols): GenericTransfer => ({
  address: erc20Transfer.address,
  symbol: tokenSymbols[erc20Transfer.address],
  fromAddress: erc20Transfer.from_address,
  toAddress: erc20Transfer.to_address,
  value: erc20Transfer.value,
  transactionHash: erc20Transfer.transaction_hash,
  blockTimestamp: erc20Transfer.block_timestamp,
  type: 'erc20',
})

export const nftToGenericTransfer = (nftTransfer): GenericTransfer => ({
  address: nftTransfer.token_address,
  fromAddress: nftTransfer.from_address,
  toAddress: nftTransfer.to_address,
  value: nftTransfer.value,
  transactionHash: nftTransfer.transaction_hash,
  blockTimestamp: nftTransfer.block_timestamp,
  type: 'nft',
})

export const getSymbolsByAddresses = async (addresses: string[], chainId: ChainId) => {
  const tokenMetadata = await Moralis.Web3API.token.getTokenMetadata({
    chain: chainId,
    addresses,
  })
  const result = {}
  tokenMetadata.forEach(metadata => {
    result[metadata.address] = metadata.symbol
  })
  return result
}
