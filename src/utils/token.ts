export const n6 = new Intl.NumberFormat('en-us', {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 6,
})

export const c2 = new Intl.NumberFormat('en-us', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const tokenValue = (value, decimals) => (decimals ? value / 10 ** decimals : value)

export const tokenValueTxt = (value, decimals, symbol) =>
  decimals ? `${n6.format(tokenValue(value, decimals))} ${symbol}` : `${value}`

export const getEllipsisTxt = (str, n = 6) => {
  return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`
}
