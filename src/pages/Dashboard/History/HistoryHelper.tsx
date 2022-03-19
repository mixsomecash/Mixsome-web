export type GenericTransfer = {
  address: string
  fromAddress: string
  toAddress: string
  value: string
  transactionHash: string
  blockTimestamp: string
  type: 'erc20' | 'nft'
}

export const erc20ToGenericTransfer = (erc20Transfer): GenericTransfer => ({
  address: erc20Transfer.address,
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
