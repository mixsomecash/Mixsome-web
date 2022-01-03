import React from 'react'
import classNames from 'classnames'

type Props = {
  title: string
  body: number
  inline?: boolean
}

const NavigationInfo = ({ title, body, inline }: Props) => {
  const containerClassName = classNames({ 'flex px-5 py-2': inline, 'px-14': !inline })

  const titleClassName = classNames(
    'flex-1',
    'font-sans',
    'text-14',
    'leading-18',
    'xl:text-18',
    'xl:leading-24',
    'font-regular',
    'mb-2',
    'text-black',
    { 'opacity-40': !inline },
    { 'opacity-80': inline },
  )

  return (
    <div className={containerClassName}>
      <div className={titleClassName}>{title}</div>
      <div className="font-mono text-16 leading-22 xl:text-20 xl:leading-26">{body}</div>
    </div>
  )
}

export default NavigationInfo
