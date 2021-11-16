/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import { SingleValueProps, components } from 'react-select'
import { IconOption } from './types'

const { SingleValue } = components

const DropdownSingleValue = (props: SingleValueProps) => {
  const { data } = props
  const option = data as IconOption
  return (
    <SingleValue {...props}>
      <div className="dropdown__singleValue">
        <div className="py-2 flex items-center">
          <div className="flex-1">{option.icon}</div>
          <div className="flex-1">{option.label}</div>
        </div>
      </div>
    </SingleValue>
  )
}

export default DropdownSingleValue
