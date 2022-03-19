import React from 'react'

interface IndicatorProps {
  name: string
  value: number
}

export const Indicator: React.FC<IndicatorProps> = (props: IndicatorProps) => {
  const { name, value } = props

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '6px' }}>
      <span>Estimated Gas:</span>
      <span>185607</span>
    </div>
  )
}
