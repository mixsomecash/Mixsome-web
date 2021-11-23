export const getEllipsisText = (str: string, n = 6) => {
  if (str) {
    return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`
  }
  return ''
}
