import React from 'react'
import classNames from 'classnames'

type Props = {
  text: string
  invert?: boolean
  fullWidth?: boolean
  disabled?: boolean
  onClick: () => void
}

const Button = ({ text, invert, fullWidth, disabled, onClick }: Props) => {
  const className = classNames(
    'focus:outline-none',
    'hover:outline-none',
    'min-w-max',
    'h-12',
    'xl:h-16',
    {
      'button--invert': invert,
      'button--primary': !invert,
      'w-full': fullWidth,
      'min-w-max': !fullWidth,
      'opacity-60': disabled,
      'hover:opacity-80': !disabled,
    },
  )

  return (
    <button className={className} type="button" onClick={onClick} disabled={disabled}>
      {text}
    </button>
  )
}

export default Button
