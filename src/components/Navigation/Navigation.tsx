import React, { useEffect, useState } from 'react'
import { useMoralis } from 'react-moralis'
import { config } from 'config'
import Account from 'components/Account/Account'
import NavigationInfo from './NavigationInfo'
import ChainsDropdown from './ChainsDropdown'

const Navigation = () => {
  const { Moralis, account, isInitialized } = useMoralis()
  const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false)
  const [memberCount, setMemberCount] = useState(0)

  const handleBurgerIconClick = () => {
    setIsMobileMenuVisible(state => !state)
  }

  const renderWallet = () => {
    return (
      <div className="hidden xl:block mx-3">
        <Account />
      </div>
    )
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
            {account ? <div className="flex justify-center items-center"> </div> : <Account />}
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
          {renderWallet()}
          {renderBurger()}
        </nav>
      </div>
      {renderMobileMenu()}
    </>
  )
}

export default Navigation
