export type NftToken = {
  amount: string | null
  block_number: string | null
  block_number_minted: string | null
  contract_type: string | null
  frozen: number | null
  is_valid: number | null
  metadata: any
  name: string | null
  owner_of: string | null
  symbol: string | null
  synced_at: Date | null
  syncing: number | null
  token_address: string | null
  token_id: string | null
  token_uri: string | null
  image?: string | null
}

export type Options = {
  amount?: number
  contractAddress: string
  receiver: string
  tokenId: string
  type: string
}

export type OpenNotification = {
  (value: string): void
}

export type SetVisibility = {
  (value: boolean): void
}

export type OnCancel = {
  (): void
}

export type SetWarning = {
  (value: string | null): void
}

export type SetAddress = {
  (value: string): void
}
