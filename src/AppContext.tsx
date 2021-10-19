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
    const get = async () => {
      const accountData = await getAccountData()

      setAccount(accountData)
    }

    get()
  }, [])

  return <AppContext.Provider value={{ account, setAccount }}>{children}</AppContext.Provider>
}

export default AppProvider
