/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { OptionProps, components } from 'react-select'
import { IconOption } from './types'

const { Option } = components

const DropdownOption = (props: OptionProps) => {
  const { data, innerProps } = props
  const option = data as IconOption
  return (
    <Option {...props}>
      <div
        {...innerProps}
        onClick={option.onClick}
        aria-hidden="true"
        className="py-2 flex items-center cursor-pointer"
      >
        <div className="flex-1">{option.icon}</div>
        <div className="flex-1">{option.label}</div>
      </div>
    </Option>
  )
}

export default DropdownOption
