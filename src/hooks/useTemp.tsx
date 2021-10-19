import { useEffect, useState, useContext } from 'react'
import { useMoralis, useMoralisCloudFunction } from 'react-moralis'

const useTemp = () => {
  const { user, isAuthenticated, web3, Moralis } = useMoralis()
  const getSmth = async () => {
    const balances = await Moralis.Web3.getAllERC20()
    const item1 = balances.find(i => i.name === 'Mixsome')
    console.log(balances)
    const { balance, contractType, decimals, name, symbol, tokenAddress } = item1
    const bal = balance
    return bal
    // console.log(item1.balance)
  }

  return {
    getSmth,
  }
}

export default useTemp
