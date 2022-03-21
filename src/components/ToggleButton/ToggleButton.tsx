import React, { ReactNode } from 'react'
import classNames from 'classnames'

type Props = {
  disabled?: boolean
  activeId: number
  options: Array<{ id: number; value: string; prefix?: ReactNode }>
  onChange: (id: number) => void
}

const ToggleButton = ({ disabled, activeId, options, onChange }: Props) => {
  const handleButtonclick = (id: number) => () => {
    onChange(id)
  }

  const renderOption = (
    { id, value, prefix }: { id: number; value: string; prefix?: ReactNode },
    index: number,
  ) => {
    const isLastOption = options.length - 1 === index

    const className = classNames('flex items-center px-4 xl:px-6 py-2 rounded', {
      'border border-green': activeId === id,
      'border border-extra-light': activeId !== id,
      'is-disabled': disabled,
      'mr-2.5': !isLastOption,
    })

    return (
      <div
        key={id}
        className={className}
        onClick={handleButtonclick(id)}
        role="button"
        tabIndex={0}
        onKeyDown={handleButtonclick(id)}
      >
        {prefix && <div className="mr-2">{prefix}</div>}
        <span className="text-16">{value}</span>
      </div>
    )
  }

  return <div className="flex w-full bg-transparent">{options.map(renderOption)}</div>
}

export default ToggleButton
