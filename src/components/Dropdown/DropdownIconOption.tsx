import React from 'react'
import { IconOption } from './types'

type Props = {
  option: IconOption
}

const DropdownIconOption = ({ option }: Props) => (
  <div className="py-2 flex items-center">
    <div className="flex-1">{option.icon}</div>
    <div className="flex-1 text-black">{option.label}</div>
  </div>
)

export default DropdownIconOption
