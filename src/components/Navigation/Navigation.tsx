import React, { useEffect, useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useMoralis } from 'react-moralis'
import { Button } from 'components'
import { config } from 'config'
import { getEllipsisText } from 'utils/formatters'
import NavigationInfo from './NavigationInfo'
import ChainsDropdown from './ChainsDropdown'
import Account from '../Account/Account'

const Navigation = () => {
  const { Moralis, account, isAuthenticated, isInitialized, authenticate, logout, enableWeb3 } =
    useMoralis()

  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false)
  const [memberCount, setMemberCount] = useState(0)

  const handleBurgerIconClick = () => {
    setIsMobileMenuVisible(state => !state)
  }

  const handleConnectClick = async () => {
    enableWeb3()
    await authenticate()
  }

  const handleDisconnectClick = () => {
    logout()
  }

  const renderLogo = () => {
    return (
      <div className="flex-1 xl:flex-grow-0 flex flex-col">
        <a className="font-mono text-20 xl:text-32" href="/">
          m1XSoM3
        </a>
        {!config.isProduction && <p className="opacity-30 text-12">Runs on Ethereum Mainnet</p>}
      </div>
    )
  }

  const renderConnectButton = () => {
    return <Account/>
  }

  const renderWalletInfo = () => {
    if (!account || !isAuthenticated) return null
    return (
      <div className="xl:justify-end flex min-w-max items-center">
        <Jazzicon diameter={64} seed={jsNumberForAddress(account)} />
        <span className="pl-4 font-bold text-base">{getEllipsisText(account)}</span>
        <div className="ml-5 hidden lg:block">
          <Button text="Disconnect" onClick={handleDisconnectClick} />
        </div>
        <div className="mx-5 lg:hidden">
          <Button invert text="Disconnect" onClick={handleDisconnectClick} />
        </div>
      </div>
    )
  }

  const fetchMemberCount = async () => {
    if (!isInitialized) return
    const count = await Moralis.Cloud.run('get_nr_users')
    setMemberCount(count)
  }

  useEffect(() => {
    fetchMemberCount()
  })

  const renderStats = () => {
    return (
      <div className="hidden xl:flex-1 xl:justify-end xl:flex">
        <NavigationInfo title="Active Members" body={memberCount} />
        <NavigationInfo title="Total Value Locked" body={0} />
        <NavigationInfo title="Total Yield Earned" body={0} />
      </div>
    )
  }

  const renderUserInfo = () => {
    return (
      <div className="hidden xl:block">
        {isAuthenticated && account ? renderWalletInfo() : renderConnectButton()}
      </div>
    )
  }

  const renderChainsDropdown = () => {
    return (
      <div className="hidden xl:block mx-3">
        <ChainsDropdown />
      </div>
    )
  }

  const renderBurger = () => {
    return (
      <button className="xl:hidden ml-6" type="button" onClick={handleBurgerIconClick}>
        <div className="burger-button p-2">
          <div />
          <div />
          <div />
        </div>
      </button>
    )
  }

  const renderMobileMenu = () => {
    if (!isMobileMenuVisible) return null

    return (
      <div className="xl:hidden fixed z-50 inset-0 bg-green flex flex-col">
        <div className="navigation--border border-b">
          <nav className="mx-5 xl:mx-10 flex items-center py-3">
            {renderLogo()}
            {renderBurger()}
          </nav>
        </div>

        <div className="flex flex-col flex-1">
          <div className="pt-10">
            <NavigationInfo inline title="Active Members" body={memberCount} />
            <NavigationInfo inline title="Total Value Locked" body={0} />
            <NavigationInfo inline title="Total Yield Earned" body={0} />
          </div>

          <div className="mx-5 pt-20">
            {account ? (
              <div className="flex justify-center items-center">
                <div className="flex-1">{renderWalletInfo()}</div>
              </div>
            ) : (
              <Button text="Connect to wallet" invert fullWidth onClick={handleConnectClick} />
            )}
          </div>

          <div className="mx-5 pt-10">
            <div className="grid grid-cols-2">
              <div>
                <ChainsDropdown />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="silver-border border-b sticky top-0 bg-white z-30 py-3 xl:py-4 lg:h-32 flex items-center">
        <nav className="mx-5 xl:mx-10 flex items-center flex-1">
          {renderLogo()}
          {renderStats()}
          {renderChainsDropdown()}
          {renderUserInfo()}
          {renderBurger()}
        </nav>
      </div>
      {renderMobileMenu()}
    </>
  )
}

export default Navigation
