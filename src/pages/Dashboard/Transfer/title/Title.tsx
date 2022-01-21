import React from 'react'
import { Typography } from 'antd'

interface Props {
  text: string
}

export const Title: React.FC<Props> = ({ text }) => (
  <Typography.Title level={3}>{text}</Typography.Title>
)
