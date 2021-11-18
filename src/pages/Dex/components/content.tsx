import React from 'react'

import { Selector } from './selector'

type Props = {
  currentNetwork: string
}

export const Content = ({ currentNetwork }: Props) => {
  return (
    <div className="dexContentWrapper">
      <p className="dexContentLabel">From</p>

      <Selector />

      <p className="dexContentLabel">To</p>

      <Selector />
    </div>
  )
}
