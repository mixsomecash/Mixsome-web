import { getAccountData } from 'clients/ethereum'
import React, { createContext, ReactNode, useEffect, useState } from 'react'

import { AccountModel } from 'types/models'

type AppContextData = {
  account: AccountModel | null
  setAccount?: (account: AccountModel | null) => void
}

export const AppContext = createContext<AppContextData>({
  account: null,
})

type Props = {
  children: ReactNode
}

const AppProvider = ({ children }: Props) => {
  const [account, setAccount] = useState<AccountModel | null>(null)

  useEffect(() => {
    ;(async () => {
      const accountData = await getAccountData()
      setAccount(accountData)
    })()
  }, [])

  const context = { account, setAccount }

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>
}

export default AppProvider
