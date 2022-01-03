import { abis } from './abis'

type DefiContractData = {
  [address: string]: { function: string; argument: string; decimals: number; abi: any }
}

export const contracts: DefiContractData = {
  '0x10ed43c718714eb63d5aa57b78b54704e256024e': {
    function: 'swapExactTokensForETH',
    argument: 'amountIn',
    decimals: 18,
    abi: abis['0x10ed43c718714eb63d5aa57b78b54704e256024e'],
  },
  '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82': {
    function: 'transfer',
    argument: 'amount',
    decimals: 18,
    abi: abis['0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'],
  },
}
