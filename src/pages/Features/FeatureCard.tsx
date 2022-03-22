import React, { Component } from 'react'

import { HeartFilled } from '@ant-design/icons'

interface CardProps {
  title: string
}

export const FeatureCard: React.FC<CardProps> = (props: CardProps) => {
  const { title } = props

  return <h1>{title}</h1>
}
