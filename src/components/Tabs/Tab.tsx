import React from 'react'
import classNames from 'classnames'

type Props = {
  id: number
  title: string
  isActive?: boolean
  isFirst: boolean
  onClick: (id: number) => void
}

const Tab = ({ id, title, isActive, isFirst, onClick }: Props) => {
  const handleClick = () => onClick(id)

  const className = classNames('py-3 select-none', {
    'border-b-2 border-green': isActive,
    'pr-4': isFirst,
    'px-4': !isFirst,
  })

  return (
    <div
      className={className}
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleClick}
    >
      <span className="text-16">{title}</span>
    </div>
  )
}

export default Tab
