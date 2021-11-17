import React, { useState } from 'react'
import ReactSelect, { ValueContainerProps, OptionProps, components } from 'react-select'
import { IconOption } from './types'
import DropdownIconOption from './DropdownIconOption'

const { ValueContainer, Option } = components

type Props = {
  options: IconOption[]
  selectedOptionKey?: string
}

const Dropdown = ({ options, selectedOptionKey }: Props) => {
  const selectedOption = options.find(option => option.key === selectedOptionKey)

  const DropdownValueContainer = (props: ValueContainerProps) => {
    const { children } = props
    return (
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <ValueContainer {...props}>
        {children}
        <div className="dropdown__singleValue">
          {selectedOption ? <DropdownIconOption option={selectedOption} /> : null}
        </div>
      </ValueContainer>
    )
  }

  const DropdownOption = (props: OptionProps) => {
    const { data } = props
    const option = data as IconOption

    const onOptionClick = () => {
      option.onClick(option)
    }

    return (
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      <Option {...props} isSelected={selectedOption?.key === option.key}>
        <div onClick={onOptionClick} aria-hidden="true">
          <DropdownIconOption option={option} />
        </div>
      </Option>
    )
  }

  return (
    <ReactSelect
      className="dropdown"
      isSearchable={false}
      options={options}
      placeholder={null}
      components={{
        Option: DropdownOption,
        ValueContainer: DropdownValueContainer,
        SingleValue: () => null,
      }}
    />
  )
}

export default Dropdown