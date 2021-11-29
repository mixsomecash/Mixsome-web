import React from 'react'

type Props = {
  message: string
}

const ErrorMessage = ({ message }: Props) => {
  return (
    <div className="text-center">
      <span className="text-18 opacity-60">{message}</span>
    </div>
  )
}

export default ErrorMessage
