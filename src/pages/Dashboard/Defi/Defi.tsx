import React, { useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { ChainId } from 'types/moralis'
import { getDefiTransactions } from './DefiHelper'

const Defi = () => {
  const { account, chainId } = useMoralis()
  useEffect(() => {
    ;(async () => {
      if (!account || !chainId) {
        return
      }
      const result = await getDefiTransactions(account, chainId as ChainId)
      console.log(result)
    })()
  }, [account, chainId])
  return <div className="text-center my-20">Defi coming soon...</div>
}

export default Defi
