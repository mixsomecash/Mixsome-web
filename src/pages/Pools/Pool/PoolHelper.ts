import { Moralis } from 'moralis'
import tokenContractAbi from 'utils/StakingPool.json'
import { AbiItem } from 'web3-utils'
import { PoolContractData, PoolInfo } from './types'

const runPoolContractFunction = async (poolInfo: PoolInfo, functionName: string, params?: any) => {
  // runContractFunction options as any, since property 'abi' is missing in the type
  return Moralis.Web3API.native
    .runContractFunction({
      address: poolInfo.address,
      chain: poolInfo.chainId,
      abi: tokenContractAbi,
      function_name: functionName,
      params,
    } as any)
    .catch(() => null)
}

export const getPoolContractData = async (
  poolInfo: PoolInfo,
  account: string,
): Promise<PoolContractData | null> => {
  await Moralis.Web3.enableWeb3()
  const stakedTotal = await runPoolContractFunction(poolInfo, 'stakedTotal')
  const poolSize = await runPoolContractFunction(poolInfo, 'poolSize')
  const maturityDays = await runPoolContractFunction(poolInfo, 'maturityDays')
  const launchTime = await runPoolContractFunction(poolInfo, 'launchTime')
  const closingTime = await runPoolContractFunction(poolInfo, 'closingTime')
  const accountStaked = await runPoolContractFunction(poolInfo, 'stakeOf', { account })
  if (stakedTotal && poolSize && closingTime && accountStaked && maturityDays && launchTime) {
    return {
      stakedTotal: parseFloat(stakedTotal),
      poolSize: parseFloat(poolSize),
      maturityDays: parseFloat(maturityDays),
      launchTime: parseFloat(launchTime),
      closingTime: parseFloat(closingTime),
      accountStaked: parseFloat(accountStaked),
    }
  }
  return null
}

export const withdrawTokens = async (poolInfo: PoolInfo) => {
  const connector = await Moralis.Web3.enableWeb3()
  const pool = new connector.eth.Contract(tokenContractAbi as AbiItem[], poolInfo.address)
  await pool.methods.withdraw.call()
}

export const getPoolMaturity = (poolContractData: PoolContractData) => {
  return poolContractData.launchTime * 1000 + poolContractData.maturityDays * 24 * 60 * 60 * 1000
}
