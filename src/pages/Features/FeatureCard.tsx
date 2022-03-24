import React, { Component } from 'react'
import { useMoralis } from 'react-moralis'
import { CaretUpOutlined } from '@ant-design/icons'

interface CardProps {
  title: string
  description: string
  parentMethod(string): Promise<boolean>
}

export const FeatureCard: React.FC<CardProps> = (props: CardProps) => {
  const { title, description, parentMethod } = props

  function keyClick() {
    return true
  }

  return (
    <div
      tabIndex={-1}
      role="button"
      style={{ display: 'flex' }}
      onClick={() => parentMethod('empty')}
      onKeyDown={keyClick}
    >
      <div
        style={{
          width: '70px',
          height: '70px',
          backgroundColor: 'white',
          border: '2px solid #979797',
          borderRadius: '4px',
        }}
      >
        <CaretUpOutlined className="pt-1 opacity-40" style={{ fontSize: '24px' }}></CaretUpOutlined>
        <h1
          style={{
            fontFamily: 'DM Sans',
            fontSize: '28px',
            lineHeight: '34px',
            height: '35px',
            fontStyle: 'normal',
            letterSpacing: ' -0.01em',

            fontWeight: 500,
          }}
          className="text-center font-bold "
        >
          13
        </h1>
      </div>
      <div className="pl-2">
        <h1 className="text-left text-24 text-regular font-bold">{title}</h1>
        <p className="text-left text-18 opacity-40 text-regular font-bold">{description}</p>
      </div>
    </div>
  )
}
