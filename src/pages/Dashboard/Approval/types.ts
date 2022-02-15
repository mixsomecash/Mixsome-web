import { ChainId } from "types/moralis";

export type ApprovalTransactions = {
  transactionHash: string;
  contractAddress: string;
  functionName: string;
  timestamp: string;
  allowance: string;
};

export type AllowanceDto = {
  chainId: ChainId;
  ownerAddress: string;
  spenderAddress: string;
  contractAddress: string;
};
