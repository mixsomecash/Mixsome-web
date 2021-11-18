import React, { useState } from 'react'

import { networks } from '../services/constants'

import { Content } from './content'

const Dex = () => {
  const [currentNetwork, setCurrentNetwork] = useState(networks[0].path)

  const handleClick = (event, path) => {
    event.preventDefault()
    setCurrentNetwork(path)
  }

  return (
    <div className="dexWrapper">
      <div>
        <h3 className="dexTitle">DEX PAGE</h3>

        <div className="dexNavWrapper">
          {networks.map(network => (
            <a
              key={network.path}
              onClick={event => handleClick(event, network.path)}
              href={`${network.path}`}
              className={network.path === currentNetwork ? 'dexNavActiveLink' : ''}
            >
              {network.title}
            </a>
          ))}
        </div>

        <Content currentNetwork={currentNetwork} />
      </div>
    </div>
  )
}

export default Dex
