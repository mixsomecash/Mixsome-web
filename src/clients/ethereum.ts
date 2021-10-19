import Web3 from 'web3'
import { ethers, Contract } from 'ethers'
import axios from 'axios'
import { useGetApproval, useGetPoolData, useGetApprovalStatus } from 'hooks'

import { config } from 'config'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum: any
  }
}
export const getAccountAddress = async () => {
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' })

    return accounts[0]
  } catch (ex) {
    return null
  }
}

export const toEth = (balance: string | number): number => {
  return parseFloat(Web3.utils.fromWei(balance.toString(), 'ether'))
}

export const getBalance = async (address: string) => {
  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    })

    return balance
  } catch (ex) {
    return null
  }
}

export const getAccountData = async () => {
  const address = await getAccountAddress()

  if (!address) return null

  const balance = await getBalance(address)

  if (!balance) return null

  return {
    address,
    balance: toEth(balance),
  }
}

export const getAbi = async (address: string) => {
  const path = `${config.etherscanUrl}?module=contract&action=getabi&address=${address}&apikey=${config.etherscanApiKey}`

  const response = await axios.get(path)

  if (response.data.message === 'NOTOK') throw new Error(`Cannot find abi with address: ${address}`)

  const abi = JSON.parse(response.data.result)

  return abi
}

export const getContract = async (address: string) => {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const abi = await getAbi(address)

    if (!abi) return null

    const contract = new Contract(address, abi, signer)

    return contract
  } catch (ex) {
    return null
  }
}

export const getSigner = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  return signer
}
