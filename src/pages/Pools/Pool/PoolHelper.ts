import { Moralis } from 'moralis'
import { MoralisToken } from 'types/moralis'
import poolAbi from 'utils/StakingPool.json'
import tokenAbi from 'utils/ERC20.json'
import { AbiItem } from 'web3-utils'
import { PoolContractData, PoolInfo } from './types'

const runPoolContractFunction = async (poolInfo: PoolInfo, functionName: string, params?: any) => {
  // runContractFunction options as any, since property 'abi' is missing in the type
  return Moralis.Web3API.native
    .runContractFunction({
      address: poolInfo.address,
      chain: poolInfo.chainId,
      abi: poolAbi,
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
  const tokenAddress = await runPoolContractFunction(poolInfo, 'tokenERC20')
  if (!tokenAddress) {
    return null
  }
  const tokenMetadata = await Moralis.Web3API.token
    .getTokenMetadata({ addresses: [tokenAddress], chain: poolInfo.chainId })
    .catch(() => null)
  if (!tokenMetadata) {
    return null
  }
  const token = tokenMetadata[0]
  const apy = await runPoolContractFunction(poolInfo, 'poolApy')
  const stakedTotal = await runPoolContractFunction(poolInfo, 'stakedTotal')
  const poolSize = await runPoolContractFunction(poolInfo, 'poolSize')
  const maturityDays = await runPoolContractFunction(poolInfo, 'maturityDays')
  const launchTime = await runPoolContractFunction(poolInfo, 'launchTime')
  const closingTime = await runPoolContractFunction(poolInfo, 'closingTime')
  const accountStaked = await runPoolContractFunction(poolInfo, 'stakeOf', { account })
  const accountStakedTime = await runPoolContractFunction(poolInfo, 'stakeTimeOf', { account })
  if (
    apy &&
    stakedTotal &&
    poolSize &&
    closingTime &&
    accountStaked &&
    accountStakedTime &&
    maturityDays &&
    launchTime
  ) {
    return {
      token,
      apy: parseFloat(apy),
      stakedTotal: parseFloat(stakedTotal),
      poolSize: parseFloat(poolSize),
      maturityDays: parseFloat(maturityDays),
      launchTime: parseFloat(launchTime),
      closingTime: parseFloat(closingTime),
      accountStaked: parseFloat(accountStaked),
      accountStakedTime: parseFloat(accountStakedTime),
    }
  }
  return null
}

export const withdrawTokens = async (poolInfo: PoolInfo, account: string) => {
  const connector = await (Moralis as any).enableWeb3()
  const pool = new connector.eth.Contract(poolAbi as AbiItem[], poolInfo.address)
  await pool.methods.withdraw().send({ from: account })
}

export const checkAllowance = async (
  poolInfo: PoolInfo,
  poolToken: MoralisToken,
  account: string,
) => {
  const connector = await Moralis.Web3.enableWeb3()
  const tokenContract = new connector.eth.Contract(tokenAbi as AbiItem[], poolToken.address)
  const result = await tokenContract.methods.allowance(account, poolInfo.address).call()
  return result !== '0'
}

export const approveTokens = async (
  poolInfo: PoolInfo,
  poolToken: MoralisToken,
  account: string,
) => {
  try {
    const connector = await Moralis.Web3.enableWeb3()
    const tokenContract = new connector.eth.Contract(tokenAbi as AbiItem[], poolToken.address)
    await tokenContract.methods
      .approve(poolInfo.address, '1157920892373161954235709850086879078')
      .send({ from: account })
    return true
  } catch {
    return false
  }
}

export const stakeTokens = async (
  poolInfo: PoolInfo,
  poolContractData: PoolContractData,
  amount: number,
  account: string,
) => {
  try {
    const connector = await Moralis.Web3.enableWeb3()
    const amountWei = amount * 10 ** parseFloat(poolContractData.token.decimals)
    const amountWeiString = amountWei.toLocaleString('fullwide', { useGrouping: false })
    const tokenContract = new connector.eth.Contract(poolAbi as AbiItem[], poolInfo.address)
    await tokenContract.methods.stake(amountWeiString).send({ from: account })
    return true
  } catch {
    return false
  }
}

export const getPoolLaunchDate = (poolContractData: PoolContractData) =>
  new Date(poolContractData.launchTime * 1000)

export const getPoolClosingDate = (poolContractData: PoolContractData) =>
  new Date(poolContractData.closingTime * 1000)

export const isPoolOpen = (poolContractData: PoolContractData) =>
  Date.now() > getPoolLaunchDate(poolContractData).getTime() &&
  Date.now() < getPoolClosingDate(poolContractData).getTime() &&
  poolContractData.poolSize !== poolContractData.stakedTotal

export const getAccountMaturityDate = (poolContractData: PoolContractData) => {
  if (poolContractData.accountStakedTime === 0 || poolContractData.accountStakedTime === null) {
    return null
  }
  return new Date(
    poolContractData.accountStakedTime * 1000 + poolContractData.maturityDays * 24 * 60 * 60 * 1000,
  )
}
