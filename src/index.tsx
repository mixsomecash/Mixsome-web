import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App'

const isProduction = process.env.REACT_APP_PRODUCTION !== 'false'

if (isProduction && window.location.protocol !== 'https:') {
  window.location.replace(
    `https:${window.location.href.substring(window.location.protocol.length)}`,
  )
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
)
