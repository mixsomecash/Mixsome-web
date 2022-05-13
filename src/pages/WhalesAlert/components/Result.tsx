import React from 'react'

interface Props {
  result: string
}

const Result = ({ result }: Props) => <p className="whales-alert-result">{result}</p>

export { Result }
