import React from 'react'

interface Props {
  error: string
}

const Error = ({ error }: Props) => <p className="whales-alert-error">{error}</p>

export { Error }
