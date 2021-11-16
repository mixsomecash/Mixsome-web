import React from 'react'
import ReactSelect from 'react-select'
import { IconOption } from './types'

import DropdownOption from './DropdownOption'
import DropdownSingleValue from './DropdownSingleValue'

type Props = {
  options: IconOption[]
}

const Dropdown = ({ options }: Props) => {
  return (
    <ReactSelect
      className="dropdown"
      isSearchable={false}
      options={options}
      components={{
        Option: DropdownOption,
        SingleValue: DropdownSingleValue,
      }}
    />
  )
}

export default Dropdown
