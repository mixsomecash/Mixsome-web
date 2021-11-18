import React from 'react'

export const Selector = () => {
  return (
    <div className="dexTokenSelectorWrapper">
      <div>
        <input className="dexTokenSelectorInput" type="text" />
      </div>
      <select className="dexTokenSelectorControl">
        <option>Eth</option>
        <option>Bsc</option>
      </select>
    </div>
  )
}
