import React, { useState, useContext } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useMoralis } from 'react-moralis'

import { Button } from 'components'
import { getAccountData } from 'clients/ethereum'
import { config } from 'config'

import NavigationInfo from './NavigationInfo'
import ChainsDropdown from './ChainsDropdown'
import { AppContext } from '../../AppContext'

const Navigation = () => {
  const { authenticate, isAuthenticated, logout } = useMoralis()
  const { account, setAccount } = useContext(AppContext)

  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false)

  const getTruncateedAddress = () => {
    if (!account) return null

    const { address } = account

    return `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`
  }

  const handleBurgerIconClick = () => {
    setIsMobileMenuVisible(state => !state)
  }

  const handleConnectClick = async () => {
    await authenticate()

    const connectedAccount = await getAccountData()

    if (setAccount && connectedAccount) setAccount(connectedAccount)
  }

  const handleDisconnectClick = () => {
    if (setAccount) setAccount(null)
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
    return <Button text="Connect to wallet" onClick={handleConnectClick} />
  }

  const renderWalletInfo = () => {
    if (!account) return null

    const { address } = account

    return (
      <div className="xl:justify-end flex min-w-max items-center">
        <Jazzicon diameter={64} seed={jsNumberForAddress(address)} />
        <span className="pl-4 font-bold text-base">{getTruncateedAddress()}</span>
        <div className="ml-5 hidden lg:block">
          <Button text="Disconnect" onClick={handleDisconnectClick} />
        </div>
        <div className="mx-5 lg:hidden">
          <Button invert text="Disconnect" onClick={handleDisconnectClick} />
        </div>
      </div>
    )
  }

  const renderStats = () => {
    return (
      <div className="hidden xl:flex-1 xl:justify-end xl:flex">
        <NavigationInfo title="Active Members" body="359" />
        <NavigationInfo title="Total Value Locked" body="$54.12M" />
        <NavigationInfo title="Total Yield Earned" body="$189,188.67" />
      </div>
    )
  }

  const renderUserInfo = () => {
    return (
      <div className="hidden xl:block">
        {isAuthenticated ? renderWalletInfo() : renderConnectButton()}
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
            <NavigationInfo inline title="Active Members" body="359" />
            <NavigationInfo inline title="Total Value Locked" body="$54.12M" />
            <NavigationInfo inline title="Total Yield Earned" body="$189,188.67" />
          </div>

          <div className="mx-5 pt-20">
            {account ? (
              <div className="flex justify-center items-center">
                <div className="flex-1">{renderWalletInfo()}</div>
                <div className="font-mono text-16 leading-22">{account.balance} ETH</div>
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
