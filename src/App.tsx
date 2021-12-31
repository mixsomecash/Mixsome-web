import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { MoralisProvider } from 'react-moralis'
import { Navigation, Sidebar } from 'components'
import { Dex, Main, NFT, Flow, Dashboard, Page404, Pools } from 'pages'
import { config } from 'config'
import AppProvider from './AppContext'

const App = () => {
  const renderWrongConfiguration = () => {
    return <div>Error: Check app configuration.</div>
  }

  if (!config.moralis.appId || !config.moralis.serverUrl) {
    return renderWrongConfiguration()
  }

  return (
    <AppProvider>
      <MoralisProvider appId={config.moralis.appId} serverUrl={config.moralis.serverUrl}>
        <Navigation />
        <Sidebar />
        <div className="w-full lg:w-4/5 ml-auto bg-silver min-h-screen">
          <div className="p-5 xl:p-10 mx-auto overflow-auto">
            <Switch>
              <Route path="/" component={Main} exact />
              <Route path="/flows" component={Main} exact />
              <Route path="/pools" component={Pools} exact />
              <Route path="/dashboard" component={Dashboard} exact />
              <Route path="/flows/:id" component={Flow} exact />
              <Route path="/1inch" component={Dex} exact />
              <Route path="/nft" component={NFT} exact />
              <Route component={Page404} />
            </Switch>
          </div>
        </div>
      </MoralisProvider>
    </AppProvider>
  )
}

export default App
