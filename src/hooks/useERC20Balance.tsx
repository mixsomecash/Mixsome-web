import { useERC20Balances } from 'react-moralis'

export const useERC20Balance = () => {
  const { data, error, isLoading } = useERC20Balances()

  return {
    assets: data?.map(token => ({ ...token, decimals: parseInt(token.decimals, 10) })),
    error: error?.message,
    isLoading,
  }
}

export default useERC20Balance
