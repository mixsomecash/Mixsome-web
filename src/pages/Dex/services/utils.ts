import type { DexToken } from '../../../types/models/dex'

export const processTokenList = tokenList => {
  return Object.entries(tokenList).map(token => {
    const currentToken = { ...(token[1] as DexToken) }
    return { ...currentToken, value: currentToken.address, label: currentToken.name }
  })
}
