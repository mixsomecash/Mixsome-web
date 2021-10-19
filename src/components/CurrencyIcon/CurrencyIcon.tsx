import React from 'react'

type Props = {
  src: string
  alt?: string
}

const CurrencyIcon = ({ src, alt }: Props) => {
  return <img className="w-6 h-6 xl:w-9 xl:h-9 ml-1 xl:ml-2.5" src={src} alt={alt} />
}

export default CurrencyIcon
