import React from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { Menu } from 'antd'

const Sidebar: React.FC = () => {
  const location = useLocation()

  const renderSocialLinks = (key: string, name: string, link: string) => (
    <Menu.Item key={key}>
      <a href={link} rel="noreferrer" target="_blank">
        {name}
      </a>
    </Menu.Item>
  )

  const renderCopy = () => (
    <p className="text-14 text-light" style={{ marginTop: 6 }}>
      &copy; {new Date().getFullYear()} Mixsome. All rights reserved.
    </p>
  )

  const renderLink = (name: string, link: string, key: string) => {
    const isActive = location.pathname === link

    return (
      <Menu.Item
        style={{
          height: 60,
          paddingLeft: isActive ? '40px' : '30px',
          backgroundColor: isActive ? '#fafafa' : undefined,
          fontWeight: key === 'dex' ? 'bold' : undefined,
        }}
        key={key}
        disabled={key === 'bridge'}
      >
        <NavLink to={link}>
          {name}
          {key === 'bridge' && (
            <span
              style={{
                backgroundColor: '#fafafa',
                borderRadius: '30%',
                fontSize: 14,
                padding: '4px 8px',
                marginLeft: 16,
              }}
            >
              Coming soon
            </span>
          )}
        </NavLink>
      </Menu.Item>
    )
  }

  return (
    <div className="relative lg:fixed w-full lg:w-1/5 lg:min-h-screen inset-0 lg:top-32 border-r silver-border">
      <div className="flex flex-col h-full">
        <Menu mode="inline" style={{ width: '100%', fontSize: 16 }}>
          {renderLink('Dashboard', '/dashboard', 'dashboard')}
          {renderLink('Pools', '/pools', 'pools')}
          {renderLink('Bridge ', '#', 'bridge')}
          {renderLink('Flows', '/', 'flows')}
          {renderLink('DEX', '/1inch', 'dex')}
        </Menu>
        <div className="hidden lg:block mt-auto mx-5 mb-32 pb-5">
          <Menu mode="horizontal">
            {renderSocialLinks('telegram', 'Telegram', 'https://t.me/mixsome')}
            {renderSocialLinks('twitter', 'Twitter', 'https://twitter.com/mixsomecash')}
            {renderSocialLinks('medium', 'Medium', 'https://mixsome-cash.medium.com/')}
          </Menu>
          {renderCopy()}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
