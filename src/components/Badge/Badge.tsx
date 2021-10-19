import React from 'react'
import classNames from 'classnames'

type Props = {
  text: string
  type?: 'black' | 'white'
  size?: 'small' | 'medium'
}

const Badge = ({ text, type = 'black', size = 'medium' }: Props) => {
  const classes = classNames('rounded-full ml-1 xl:mx-2 px-2 xl:px-4 py-1 text-center', {
    'bg-black text-white': type === 'black',
    'bg-silver text-light': type === 'white',
    'text-12 leading-18 xl:leading-22': size === 'small',
    'text-14 xl:text-16 leading-18 xl:leading-22': size === 'medium',
  })

  return <div className={classes}>{text}</div>
}

export default Badge
