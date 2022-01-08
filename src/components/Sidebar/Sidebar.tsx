import React from 'react'
import { useLocation } from 'react-router-dom'

import { Badge } from 'components'
import classNames from 'classnames'

const Sidebar = () => {
  const location = useLocation()

  const renderComingSoonBadge = () => (
    <div className="ml-auto">
      <Badge type="white" text="Coming soon" size="small" />
    </div>
  )

  const renderSocialLinks = () => (
    <div className="mb-5 w-full flex">
      <a className="hover:underline" target="_blank" rel="noreferrer" href="https://t.me/mixsome">
        Telegram
      </a>
      <a
        className="mx-auto hover:underline"
        target="_blank"
        rel="noreferrer"
        href="https://twitter.com/mixsomecash"
      >
        Twitter
      </a>
      <a
        className="hover:underline"
        target="_blank"
        rel="noreferrer"
        href="https://mixsome-cash.medium.com/"
      >
        Medium
      </a>
    </div>
  )

  const renderCopy = () => (
    <p className="text-14 text-light">
      &copy; {new Date().getFullYear()} Mixsome. All rights reserved.
    </p>
  )

  const renderLink = (name: string, link: string) => {
    const isActive = location.pathname === link
    const classes = classNames(
      'w-full border-b silver-border py-4 pr-5 px-5 lg:px-10 lg:pr-10 text-14 lg:text-16 font-regular',
      { 'pl-10 lg:pl-14 bg-silver': isActive },
    )

    return (
      <div className={classes}>
        <a className="hover:underline" href={link}>
          {name}
        </a>
      </div>
    )
  }

  return (
    <div className="relative lg:fixed w-full lg:w-1/5 lg:min-h-screen inset-0 lg:top-32 border-r silver-border">
      <div className="flex flex-col h-full">
        <nav>
          {renderLink('Dashboard', '/dashboard')}
          {renderLink('Pools', '/pools')}
          <div className="w-full border-b silver-border py-4 px-5 lg:px-10 text-14 lg:text-16 font-regular flex items-center">
            <span className="opacity-40">Bridge</span>
            {renderComingSoonBadge()}
          </div>
          {renderLink('Flows', '/')}
          {renderLink('Wallet', '/wallet')}
        </nav>
        <div className="hidden lg:block mt-auto mx-5 mb-32 pb-5">
          {renderSocialLinks()}
          {renderCopy()}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
