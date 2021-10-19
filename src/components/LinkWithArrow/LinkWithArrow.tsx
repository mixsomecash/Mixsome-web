import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

type Props = {
  url: string
  text: string
  arrowSide: 'left' | 'right'
}

const LinkWithArrow = ({ url, text, arrowSide }: Props) => {
  const renderArrow = () => {
    const className = classNames('link-with-arrow__icon', {
      'link-with-arrow__icon--left': arrowSide === 'left',
      'link-with-arrow__icon--right': arrowSide === 'right',
      'transform rotate-180': arrowSide === 'left',
    })

    return <img className={className} src="/images/icons/arrow.svg" alt="" />
  }

  const textClassName = classNames({ 'ml-12 mt-1': arrowSide === 'left' })

  return (
    <Link to={url}>
      <div className="select-none link-with-arrow__container font-bold text-12 xl:text-16 flex items-center">
        {arrowSide === 'left' && renderArrow()}
        <div className={textClassName}>{text}</div>
        {arrowSide === 'right' && renderArrow()}
      </div>
    </Link>
  )
}

export default LinkWithArrow
