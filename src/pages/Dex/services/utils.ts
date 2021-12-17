import type { DexToken } from '../../../types/models/dex'

import { NETWORK_CONFIGS } from './constants'

export const processTokenList = tokenList => {
  return Object.entries(tokenList).map(token => {
    const currentToken = { ...(token[1] as DexToken) }
    return { ...currentToken, value: currentToken.address, label: currentToken.name }
  })
}

export const isNative = address => address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'

export const getWrappedNative = chain => NETWORK_CONFIGS[chain]?.wrapped || null
