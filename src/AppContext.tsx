import { getAccountData } from 'clients/ethereum'
import React, { createContext, ReactNode, useEffect, useState } from 'react'

import { AccountModel } from 'types/models'

type AppContextData = {
  account: AccountModel | null
  chainId?: string
  setAccount?: (account: AccountModel | null) => void
  setChainId: (id: string) => void
}

export const AppContext = createContext<AppContextData>({
  account: null,
  chainId: undefined,
  setChainId: () => {},
})

type Props = {
  children: ReactNode
}

const AppProvider = ({ children }: Props) => {
  const [account, setAccount] = useState<AccountModel | null>(null)
  const [chainId, setChainId] = useState<string | undefined>(undefined)

  useEffect(() => {
    const get = async () => {
      const accountData = await getAccountData()

      setAccount(accountData)
    }

    get()
  }, [])

  const context = { account, chainId, setAccount, setChainId }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export default AppProvider
